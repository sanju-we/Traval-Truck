import { IRoomType, IRoomsDocument } from "../../core/interface/modelInterface/IRoomType";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository";
import { BaseRepository } from "../../repositories/baseRepository";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors";
import { toRoomsDTO, RoomsDTO } from "../../core/DTO/hotel/roomsDTO";
import { logger } from "../../utils/logger";
import { PaginationResponse } from "../../core/DTO/pagination.DTO";
import mongoose from "mongoose";
import RoomType from "../../models/RoomType";

export class HotelRoomsRepository extends BaseRepository<IRoomsDocument> implements IHotelRoomsRepository {
  constructor() {
    super(RoomType)
  }

  async findAllPackageWithPartners(
    page: number = 1,
    status?: string,
    lim: number = 10,
    search?: number,
    hotelID?: string
  ): Promise<PaginationResponse<RoomsDTO>> {

    page = Math.max(page, 1);
    lim = Math.max(lim, 1);
    const skip = (page - 1) * lim;

    const filter: any = hotelID ? {
      HotelId: hotelID,
    } : {};

    if (search !== undefined && search !== null && search != 0) {
      filter.RoomNumber = search;
    }

    if (status) {
      filter.Status = status;
    }

    logger.info({ filter });

    const [rooms, total] = await Promise.all([
      RoomType.find(filter).skip(skip).limit(lim).lean(),
      RoomType.countDocuments(),
    ]);

    return {
      data: rooms.map(toRoomsDTO),
      totalCount: total,
      totalPage: Math.ceil(total / lim),
    };
  }

  async findByHotelId(hotelId: string): Promise<IRoomsDocument[]> {
    const Id = new mongoose.Types.ObjectId(hotelId);
    const rooms = await RoomType.find({isBlocked: false});
    console.log(`Rooms for hotel ${hotelId}:`, rooms);
    return rooms;
  }

  async findPackageWithPartner(id: string): Promise<RoomsDTO> {
    const data = await RoomType.findById(id)
      .populate('HotelId')
      .lean()
    if (data) return toRoomsDTO(data)
    throw new DataNotFoundError()
  }
}