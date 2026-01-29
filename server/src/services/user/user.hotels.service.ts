import { IUserHotelsService } from "../../core/interface/serivice/user/IUser.hotels.service";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository";
import { inject, injectable } from "inversify";
import { RoomsDTO } from "../../core/DTO/hotel/roomsDTO";
import { DataNotFoundError, ROOM_ALREADY_OCCUPAID } from "../../utils/resAndErrors";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";

@injectable()
export class UserHotelsService implements IUserHotelsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _hotelRoomRepo: IHotelRoomsRepository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository,
    @inject('IPaymentUtils') private readonly _paymentUtils: IPaymentUtils,
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
  ) { }

  async getAllHotels(page: number, limit: number, search?: string): Promise<{ data: RoomsDTO[]; total: number; page: number; totalPages: number; }> {
    const data = await this._hotelRoomRepo.findAllPackageWithPartners(page, limit, search)
    const checks = await Promise.all(
      data.data.map(async (pkg) => {
        const room = await this._subscriptionHistoryRepo.findOne({
          userId: pkg.HotelId,
        })
        return room ? pkg : null
      })
    )
    const result = checks.filter((pkg) => pkg !== null) as RoomsDTO[]
    data.data = result
    if (data) return data
    throw new DataNotFoundError()
  }

  async getRoom(id: string): Promise<RoomsDTO> {
    const data = await this._hotelRoomRepo.findPackageWithPartner(id)
    const room = await this._subscriptionHistoryRepo.findOne({
      userId: data.HotelId,
    })
    if (room) return data
    throw new DataNotFoundError()
  }

  async initializeSession(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string): Promise<{ url: string; sessionId: string; }> {
    const room = await this._hotelRoomRepo.findById(roomId);
    if (!room) throw new DataNotFoundError();

    const orders = await this._orderRepo.findAll({product:roomId,status:{$in:['Upcoming','Ongoing']}},{});
    console.log(orders)
    if (orders.length > 0) {
      const days = amount / room.PricePerNight

      const date = new Date(startDate);
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + days);

      function isDateRangeOverlapping(
        startA: Date,
        endA: Date,
        startB: Date,
        endB: Date
      ): boolean {
        return startA < endB && startB < endA
      }

      for (const order of orders) {
        if (!order.startDate || !order.endDate) continue

        const isOverlap = isDateRangeOverlapping(
          date,
          endDate,
          new Date(order.startDate),
          new Date(order.endDate)
        )

        if (isOverlap) throw new ROOM_ALREADY_OCCUPAID()
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