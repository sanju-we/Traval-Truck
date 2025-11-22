import { IUserHotelsService } from "../../core/interface/serivice/user/IUser.hotels.service.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { inject, injectable } from "inversify";
import { RoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js";

@injectable()
export class UserHotelsService implements IUserHotelsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _hotelRoomRepo: IHotelRoomsRepository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository
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
    if(room) return  data 
    throw new DataNotFoundError() 
  }
}