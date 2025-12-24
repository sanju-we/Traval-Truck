import Rooms from "../../models/Rooms.js";
import { IRooms } from "../../core/interface/modelInterface/IRooms.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { toRoomsDTO, RoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { logger } from "../../utils/logger.js";
import { isBlock } from "typescript";

export class HotelRoomsRepository extends BaseRepository<IRooms> implements IHotelRoomsRepository {
  constructor() {
    super(Rooms)
  }

  async findAllPackageWithPartners(page = 1, lim?: number, search?:string): Promise<{ data: RoomsDTO[], total: number, page: number, totalPages: number }> {
    const limit = lim || 6;
    const skip = (page - 1) * limit;
    const searchFilter = search
    ? { RoomNumber: Number(search),isBlock:false}
    : {isBlock:false};
    logger.info(searchFilter)
    const [packages, total] = await Promise.all([
      Rooms.find(searchFilter)
        .populate('HotelId')
        .skip(skip)
        .limit(limit)
        .lean(),
      Rooms.countDocuments()
    ]);

    // if (!packages.length) throw new Data_Creation_Error();

    return {
      data: packages.map(toRoomsDTO),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findPackageWithPartner(id: string): Promise<RoomsDTO> {
    const data = await Rooms.findById(id)
      .populate('HotelId')
      .lean()
    if (data) return toRoomsDTO(data)
    throw new DataNotFoundError()
  }
}