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

@injectable()
export class UserHotelsService implements IUserHotelsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _hotelRoomRepo: IHotelRoomsRepository,
    @inject('IHotelAuthRepository') private readonly _hotelAuthRepo: IHotelAuthRepository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository,
    @inject('IPaymentUtils') private readonly _paymentUtils: IPaymentUtils,
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
  ) { }

  async getAllHotels(page: number, limit: number, search?: string): Promise<PaginationResponse<any>> {
    const query = { search: search || '', status: 'approved' };
    const hotelsData = await this._hotelAuthRepo.findAllWithpagination(query, limit, page);

    // Filter hotels that have active subscriptions
    const checks = await Promise.all(
      hotelsData.data.map(async (hotel) => {
        const hasSubscription = await this._subscriptionHistoryRepo.findOne({
          userId: hotel._id,
        });

        // Also check if they have at least one room type
        const rooms = await this._hotelRoomRepo.findByHotelId(hotel._id.toString());

        if (hasSubscription && rooms.length > 0) {
          return {
            ...hotel.toObject ? hotel.toObject() : hotel,
            id: hotel._id.toString(),
            PricePerNight: rooms[0].PricePerNight // For listing purposes
          };
        }
        return null;
      })
    );

    const result = checks.filter((h) => h !== null);

    return {
      data: result,
      totalCount: result.length, // This might be wrong for pagination, but simplified for now
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

        // If the required rooms for this type exceed total available units, skip
        if (requiredRooms > (room.AvailableCount || 1)) return null;

        // Check availability for dates
        const orders = await this._orderRepo.findAll({
          product: room.id,
          status: { $in: ['Upcoming', 'Ongoing'] }
        }, {});

        // Count overlapping rooms per day
        const dateRange = [];
        let curr = new Date(start);
        while (curr < end) {
          dateRange.push(new Date(curr));
          curr.setDate(curr.getDate() + 1);
        }

        const isAvailable = dateRange.every(date => {
          let bookedOnThisDay = 0;
          orders.forEach(order => {
            if (order.startDate && order.endDate) {
              const oStart = new Date(order.startDate);
              const oEnd = new Date(order.endDate);
              if (date >= oStart && date < oEnd) {
                // We need to know how many rooms were booked in this order.
                // Assuming 'people' was saved in order and we can derive rooms.
                const orderRooms = Math.ceil((order.people || 1) / room.Capacity);
                bookedOnThisDay += orderRooms;
              }
            }
          });
          return (bookedOnThisDay + requiredRooms) <= (room.AvailableCount || 1);
        });

        return isAvailable ? { ...room, requiredRooms } : null;
      }));

      roomsDTOs = filteredRooms.filter(r => r !== null) as RoomsDTO[];
    }

    return roomsDTOs;
  }

  async getHotelDetails(hotelId: string): Promise<any> {
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

  async initializeSession(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string, people: number): Promise<{ url: string; sessionId: string; }> {
    const room = await this._hotelRoomRepo.findById(roomId);
    if (!room) throw new DataNotFoundError();

    const days = Math.round(amount / room.PricePerNight);
    const date = new Date(startDate);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + days);

    const requiredRooms = Math.ceil(people / room.Capacity);
    if (requiredRooms > (room.AvailableCount || 1)) throw new ROOM_ALREADY_OCCUPAID();

    const orders = await this._orderRepo.findAll({
      product: roomId,
      status: { $in: ['Upcoming', 'Ongoing'] }
    }, {});

    if (orders.length > 0) {
      let curr = new Date(date);
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
        amount,
        roomId,
        couponId,
        startDate
      }
    })
  }
}