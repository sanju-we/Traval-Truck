"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRoomsRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const resAndErrors_1 = require("../../utils/resAndErrors");
const roomsDTO_1 = require("../../core/DTO/hotel/roomsDTO");
const logger_1 = require("../../utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
const RoomType_1 = __importDefault(require("../../models/RoomType"));
class HotelRoomsRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(RoomType_1.default);
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
            RoomType_1.default.find(filter).skip(skip).limit(lim).lean(),
            RoomType_1.default.countDocuments(),
        ]);
        return {
            data: rooms.map(roomsDTO_1.toRoomsDTO),
            totalCount: total,
            totalPage: Math.ceil(total / lim),
        };
    }
    async findByHotelId(hotelId) {
        const Id = new mongoose_1.default.Types.ObjectId(hotelId);
        const rooms = await RoomType_1.default.find({ HotelId: Id, isBlocked: false });
        console.log(`Rooms for hotel ${hotelId}:`, rooms);
        return rooms;
    }
    async findPackageWithPartner(id) {
        const data = await RoomType_1.default.findById(id)
            .populate('HotelId')
            .lean();
        if (data)
            return (0, roomsDTO_1.toRoomsDTO)(data);
        throw new resAndErrors_1.DataNotFoundError();
    }
}
exports.HotelRoomsRepository = HotelRoomsRepository;
