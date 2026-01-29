"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRoomsRepository = void 0;
const Rooms_1 = __importDefault(require("../../models/Rooms"));
const baseRepository_1 = require("../../repositories/baseRepository");
const resAndErrors_1 = require("../../utils/resAndErrors");
const roomsDTO_1 = require("../../core/DTO/hotel/roomsDTO");
const logger_1 = require("../../utils/logger");
class HotelRoomsRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Rooms_1.default);
    }
    async findAllPackageWithPartners(page = 1, lim, search) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const searchFilter = search
            ? { RoomNumber: Number(search), isBlocked: false }
            : { isBlocked: false };
        logger_1.logger.info(searchFilter);
        const [packages, total] = await Promise.all([
            Rooms_1.default.find(searchFilter)
                .populate('HotelId')
                .skip(skip)
                .limit(limit)
                .lean(),
            Rooms_1.default.countDocuments()
        ]);
        // if (!packages.length) throw new Data_Creation_Error();
        return {
            data: packages.map(roomsDTO_1.toRoomsDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findPackageWithPartner(id) {
        const data = await Rooms_1.default.findById(id)
            .populate('HotelId')
            .lean();
        if (data)
            return (0, roomsDTO_1.toRoomsDTO)(data);
        throw new resAndErrors_1.DataNotFoundError();
    }
}
exports.HotelRoomsRepository = HotelRoomsRepository;
