import Rooms from "../../models/Rooms.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { toRoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
export class HotelRoomsRepository extends BaseRepository {
    constructor() {
        super(Rooms);
    }
    async findAllPackageWithPartners(page = 1, lim) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const [packages, total] = await Promise.all([
            Rooms.find()
                .populate('HotelId')
                .skip(skip)
                .limit(limit)
                .lean(),
            Rooms.countDocuments()
        ]);
        if (!packages.length)
            throw new Data_Creation_Error();
        return {
            data: packages.map(toRoomsDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
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
