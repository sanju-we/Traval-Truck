import Rooms from "../../models/Rooms.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { toRoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { logger } from "../../utils/logger.js";
export class HotelRoomsRepository extends BaseRepository {
    constructor() {
        super(Rooms);
    }
    async findAllPackageWithPartners(page = 1, status, lim, search, hotelID) {
        const skip = Math.abs((page - 1) * lim);
        const filter = {
            HotelId: hotelID,
            isBlocked: false
        };
        if (search) {
            filter.RoomNumber = Number(search);
        }
        if (status) {
            filter.status = status;
        }
        logger.info(filter);
        const [rooms, total] = await Promise.all([
            Rooms.find(filter)
                .populate('HotelId')
                .skip(skip)
                .limit(lim)
                .lean(),
            Rooms.countDocuments(filter)
        ]);
        return {
            data: rooms.map(toRoomsDTO),
            totalCount: total,
            totalPage: Math.ceil(total / lim)
        };
    }
    async findPackageWithPartner(id) {
        const data = await Rooms.findById(id)
            .populate('HotelId')
            .lean();
        if (data)
            return toRoomsDTO(data);
        throw new DataNotFoundError();
    }
}
