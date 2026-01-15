import Rooms from "../../models/Rooms.js";
import { IRooms } from "../../core/interface/modelInterface/IRooms.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { toRoomsDTO, RoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { logger } from "../../utils/logger.js";
import { PaginationResponse } from "../../core/DTO/pagination.DTO.js";
import mongoose from "mongoose";

export class HotelRoomsRepository extends BaseRepository<IRooms> implements IHotelRoomsRepository {
  constructor() {
    super(Rooms)
  }

  async findAllPackageWithPartners(
  page: number = 1,
  status?: string,
  lim: number = 10,
  search?: number,
  hotelID?: string
): Promise<PaginationResponse<RoomsDTO>> {
  if (!hotelID) {
    throw new Data_Creation_Error();
  }

  page = Math.max(page, 1);
  lim = Math.max(lim, 1);
  const skip = (page - 1) * lim;

  const filter: any = {
    HotelId: hotelID,
  };

  if (search !== undefined && search !== null && search != 0) {
    filter.RoomNumber = search;
  }

  if (status) {
    filter.Status = status;
  }

  logger.info({ filter });

  const [rooms, total] = await Promise.all([
    Rooms.find(filter).skip(skip).limit(lim).lean(),
    Rooms.countDocuments(),
  ]);

  return {
    data: rooms.map(toRoomsDTO),
    totalCount: total,
    totalPage: Math.ceil(total / lim),
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