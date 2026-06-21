import { IUserHotelsService } from "../../core/interface/serivice/user/IUser.hotels.service";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository";
import { IHotelAuthRepository } from "../../core/interface/repositorie/Hotel/Ihotel.auth.repository";
import { inject, injectable } from "inversify";
import { RoomsDTO, toRoomsDTO } from "../../core/DTO/hotel/roomsDTO";
import { DataNotFoundError, ROOM_ALREADY_OCCUPAID } from "../../utils/resAndErrors";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";
import { PaginationResponse } from "@core/DTO/pagination.DTO";
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository";
import { Types } from "mongoose";

@injectable()
export class UserHotelsService implements IUserHotelsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _hotelRoomRepo: IHotelRoomsRepository,
    @inject('IHotelAuthRepository') private readonly _hotelAuthRepo: IHotelAuthRepository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository,
    @inject('IPaymentUtils') private readonly _paymentUtils: IPaymentUtils,
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
    @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository,
  ) { }

  async getAllHotels(page: number, limit: number, search?: string, minRating?: number, sortBy?: string): Promise<PaginationResponse<unknown>> {
    const query = { search: search || '', status: 'Activity', minRating };
    const hotelsData = await this._hotelAuthRepo.findAllWithpagination(query, limit, page, sortBy);

    const checks = await Promise.all(
      hotelsData.data.map(async (hotel) => {
        const hotelId = hotel._id.toString();

        const hasSubscription = await this._subscriptionHistoryRepo.findOne(
          {
            userId: hotelId,
            status: 'active',
            endDate: { $gt: new Date() }
          },
          { sort: { createdAt: -1 } }
        );

        const rooms = await this._hotelRoomRepo.findByHotelId(hotelId);
        console.log(`Hotel ID: ${hotelId}, Has Active Subscription: ${hasSubscription}, And rooms are ${rooms}`);

        if (hasSubscription && rooms.length > 0) {
          const hotelObj = hotel.toObject ? hotel.toObject() : hotel;
          return {
            ...hotelObj,
            id: hotelId,
            PricePerNight: rooms[0].PricePerNight
          };
        }
        return null;
      })
    );
    console.log(checks);
    const result = checks.filter((h) => h !== null);

    return {
      data: result,
      totalCount: result.length,
      totalPage: Math.ceil(result.length / limit),
    };
  }

  async getRoomsByHotel(hotelId: string, searchParams?: { startDate?: string; endDate?: string; people?: number }): Promise<RoomsDTO[]> {
    const rooms = await this._hotelRoomRepo.findByHotelId(hotelId);
    let roomsDTOs = rooms.map(toRoomsDTO);

    if (searchParams && searchParams.startDate && searchParams.endDate && searchParams.people) {
      const { startDate, endDate, people } = searchParams;
      const start = new Date(startDate);
      const end = new Date(endDate);

      const filteredRooms = await Promise.all(roomsDTOs.map(async (room) => {
        const requiredRooms = Math.ceil(people / room.Capacity);

        const orders = await this._orderRepo.findAll({
          product: room.id,
          status: { $in: ['Upcoming', 'Ongoing'] }
        }, {});

        const dateRange = [];
        const curr = new Date(start);
        while (curr < end) {
          dateRange.push(new Date(curr));
          curr.setDate(curr.getDate() + 1);
        }

        let maxBookedOnAnyDay = 0;

        dateRange.forEach(date => {
          let bookedOnThisDay = 0;
          orders.forEach(order => {
            if (order.startDate && order.endDate) {
              const oStart = new Date(order.startDate);
              const oEnd = new Date(order.endDate);
              if (date >= oStart && date < oEnd) {
                const orderRooms = Math.ceil((order.people || 1) / room.Capacity);
                bookedOnThisDay += orderRooms;
              }
            }
          });
          if (bookedOnThisDay > maxBookedOnAnyDay) maxBookedOnAnyDay = bookedOnThisDay;
        });

        const remainingCount = (room.AvailableCount || 1) - maxBookedOnAnyDay;

        if (remainingCount >= requiredRooms) {
          return { ...room, AvailableCount: remainingCount, requiredRooms };
        }
        return null;
      }));

      roomsDTOs = filteredRooms.filter(r => r !== null) as RoomsDTO[];
    }

    return roomsDTOs;
  }

  async getHotelDetails(hotelId: string): Promise<unknown> {
    const hotel = await this._hotelAuthRepo.findById(hotelId);
    if (!hotel) throw new DataNotFoundError();
    return hotel;
  }

  async getRoom(id: string): Promise<RoomsDTO> {
    const data = await this._hotelRoomRepo.findPackageWithPartner(id)
    const room = await this._subscriptionHistoryRepo.findOne({
      userId: data.HotelId,
    })
    if (room) return data
    throw new DataNotFoundError()
  }

  async initializeSession(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string, people: number, guestName?: string, guestAge?: number): Promise<{ url: string; sessionId: string; }> {
    const room = await this._hotelRoomRepo.findById(roomId);
    if (!room) throw new DataNotFoundError();

    const requiredRooms = Math.ceil(people / (room.Capacity || 1));
    const days = Math.round(amount / (room.PricePerNight * requiredRooms)) || 1;
    const date = new Date(startDate);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + days);

    if (requiredRooms > (room.AvailableCount || 1)) throw new ROOM_ALREADY_OCCUPAID();

    const orders = await this._orderRepo.findAll({
      product: roomId,
      status: { $in: ['Upcoming', 'Ongoing'] }
    }, {});

    if (orders.length > 0) {
      const curr = new Date(date);
      while (curr < endDate) {
        let bookedOnThisDay = 0;
        orders.forEach(order => {
          if (order.startDate && order.endDate) {
            const oStart = new Date(order.startDate);
            const oEnd = new Date(order.endDate);
            if (curr >= oStart && curr < oEnd) {
              const orderRooms = Math.ceil((order.people || 1) / room.Capacity);
              bookedOnThisDay += orderRooms;
            }
          }
        });

        if ((bookedOnThisDay + requiredRooms) > (room.AvailableCount || 1)) {
          throw new ROOM_ALREADY_OCCUPAID();
        }
        curr.setDate(curr.getDate() + 1);
      }
    }

    return this._paymentUtils.createCheckoutSession({
      amount: amount,
      currency: 'inr',
      description: `Room Number: ${room.RoomNumber}`,
      successUrl: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        type: 'booking',
        userId,
        role,
        amount: amount.toString(),
        roomId,
        couponId,
        startDate,
        endDate: endDate.toISOString(),
        people: people.toString(),
        ...(guestName && { guestName }),
        ...(guestAge && { guestAge: guestAge.toString() })
      }
    })
  }

  async walletPurchase(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string, people: number, guestName?: string, guestAge?: number): Promise<{ success: boolean; message: string }> {
    const room = await this._hotelRoomRepo.findById(roomId);
    if (!room) throw new DataNotFoundError();

    const orders = await this._orderRepo.findAll({ userId: userId }, {})

    const day = new Date()

    const today = orders.filter((order) => order.createdAt > day)

    let cancelCount = 0;

    for (let i = 0; i < today.length; i++) {
      if (today[i].status === 'cancelled') cancelCount++
    }

    if (cancelCount >= 2) throw new DataNotFoundError()

    const requiredRooms = Math.ceil(people / (room.Capacity || 1));
    if (requiredRooms > (room.AvailableCount || 1)) {
      return { success: false, message: 'Not enough rooms available' };
    }

    const wallet = await this._walletRepo.FindByUserId(userId);
    if (!wallet) throw new DataNotFoundError();

    if (wallet.Balance < amount) {
      return { success: false, message: 'Insufficient wallet balance' };
    }

    const days = Math.round(amount / (room.PricePerNight * requiredRooms)) || 1;
    const checkIn = new Date(startDate);
    const endDate = new Date(checkIn);
    endDate.setDate(endDate.getDate() + days);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const count = (await this._orderRepo.countDocuments({}) + 1).toString().padStart(6, '0')
    const date = new Date()
    const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`

    const orderData = await this._orderRepo.create({
      orderId: orderId,
      amount: amount,
      userId: new Types.ObjectId(userId),
      productType: 'Rooms',
      role: 'Hotel',
      product: new Types.ObjectId(roomId),
      people: people,
      guestName: guestName,
      guestAge: guestAge,
      ownedBy: room.HotelId.toString(),
      couponApplied: couponId || 'none',
      paymentType: 'wallet',
      startDate: checkIn.toISOString(),
      endDate: endDate.toISOString()
    });

    if (!orderData) {
      return { success: false, message: 'Failed to create booking order' };
    }

    wallet.Balance -= amount;
    const transaction = {
      Type: 'debit',
      Amount: amount,
      Description: `Booking of Room #${room.RoomNumber} with order ID ${orderId}`,
      Date: new Date(),
    };
    wallet.Transaction.push(transaction);
    await this._walletRepo.update(wallet.id, wallet);

    const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
    if (adminWallet) {
      const adminTransaction = {
        Type: 'credit',
        Amount: amount,
        Description: `Room Booking amount ${amount} of ${orderId}.`,
        Date: new Date(),
        orderId: orderData._id.toString()
      };
      adminWallet.Transaction.push(adminTransaction);
      adminWallet.Balance += amount;
      await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
    }

    return { success: true, message: 'Purchase successful' };
  }
}