import { IUserHotelsService } from "../../core/interface/serivice/user/IUser.hotels.service.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { inject, injectable } from "inversify";
import { RoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

@injectable()
export class UserHotelsService implements IUserHotelsService{
  constructor(
    @inject('IHotelRoomsRepository') private readonly _hotelRoomRepo : IHotelRoomsRepository
  ){}
  
  async getAllHotels(page: number, limit: number): Promise<{ data: RoomsDTO[]; total: number; page: number; totalPages: number; }> {
      const data = await this._hotelRoomRepo.findAllPackageWithPartners(page,limit)
      if(data) return data
      throw new DataNotFoundError()
  }

  async getRoom(id: string): Promise<RoomsDTO> {
      const data = await this._hotelRoomRepo.findPackageWithPartner(id)
      return data
  }
}