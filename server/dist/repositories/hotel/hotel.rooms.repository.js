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
    async findAllPackageWithPartners(page = 1, status, lim = 10, search, hotelID) {
        page = Math.max(page, 1);
        lim = Math.max(lim, 1);
        const skip = (page - 1) * lim;
        const filter = hotelID ? {
            HotelId: hotelID,
        } : {};
        if (search !== undefined && search !== null && search != 0) {
            filter.RoomNumber = search;
        }
        if (status) {
            filter.Status = status;
        }
        logger_1.logger.info({ filter });
        const [rooms, total] = await Promise.all([
            Rooms_1.default.find(filter).skip(skip).limit(lim).lean(),
            Rooms_1.default.countDocuments(),
        ]);
        return {
            data: rooms.map(roomsDTO_1.toRoomsDTO),
            totalCount: total,
            totalPage: Math.ceil(total / lim),
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
