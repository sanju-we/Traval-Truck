"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRoomsService = void 0;
const zod_1 = __importDefault(require("zod"));
const roomsDTO_1 = require("../../core/DTO/hotel/roomsDTO");
const logger_1 = require("../../utils/logger");
const upload_cloudinary_1 = require("../../utils/upload.cloudinary");
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
let HotelRoomsService = class HotelRoomsService {
    constructor(_roomsRepo, _authValidator, _roomValidator) {
        this._roomsRepo = _roomsRepo;
        this._authValidator = _authValidator;
        this._roomValidator = _roomValidator;
    }
    async getAllRooms(hotelID, page, search, Description) {
        const allData = await this._roomsRepo.findAllPackageWithPartners(page, Description, 5, search, hotelID);
        return allData;
    }
    async addRoom(data, file) {
        await this._authValidator.RoomValidator(data);
        const Image = [];
        for (const img of file) {
            const url = await (0, upload_cloudinary_1.singleUpload)(img, 'Travel-Travel-Document');
            Image.push(url);
        }
        const createdData = await this._roomsRepo.create({ ...data, Images: Image, Status: 'Available' });
        return (0, roomsDTO_1.toRoomsDTO)(createdData);
    }
    async getRoom(id) {
        const schema = zod_1.default.string().min(10);
        schema.parse(id);
        const room = await this._roomsRepo.findById(id);
        if (room)
            return (0, roomsDTO_1.toRoomsDTO)(room);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async updateStatus(data) {
        await this._authValidator.updateStatusValidator(data.id, data.status);
        const update = await this._roomsRepo.update(data.id, { ['Status']: data.status });
        if (update)
            return (0, roomsDTO_1.toRoomsDTO)(update);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async updateBlock(data) {
        const schema = zod_1.default.object({
            id: zod_1.default.string().min(10),
            status: zod_1.default.boolean()
        });
        schema.parse(data);
        const update = await this._roomsRepo.update(data.id, { isBlocked: data.status });
        if (update)
            return (0, roomsDTO_1.toRoomsDTO)(update);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async getEditRoom(id) {
        const schema = zod_1.default.string().min(10);
        schema.parse(id);
        const room = await this._roomsRepo.findById(id);
        if (room)
            return (0, roomsDTO_1.toRoomsDTO)(room);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async updateRoom(data, id, files) {
        console.log(data);
        await this._roomValidator.roomValidator(data);
        const room = await this._roomsRepo.findById(id);
        if (!room)
            throw new resAndErrors_1.DataNotFoundError();
        const Image = room.Images;
        for (const img of files) {
            const url = await (0, upload_cloudinary_1.singleUpload)(img, 'Travel-Travel-Document');
            Image.push(url);
        }
        const updatedRoom = await this._roomsRepo.update(id, { ...data, Images: Image });
        if (updatedRoom)
            return (0, roomsDTO_1.toRoomsDTO)(updatedRoom);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async deleteSingleImage(id, index) {
        const room = await this._roomsRepo.findById(id);
        if (!room)
            throw new resAndErrors_1.DataNotFoundError();
        const publicId = await (0, upload_cloudinary_1.extractPublicId)(room.Images[index]);
        logger_1.logger.info(`publidId ${publicId}`);
        const deleted = await (0, upload_cloudinary_1.deleteImage)(publicId);
        if (!deleted)
            throw new resAndErrors_1.DataNotFoundError();
        room.Images.splice(index, 1);
        await room.save();
        return (0, roomsDTO_1.toRoomsDTO)(room);
    }
};
exports.HotelRoomsService = HotelRoomsService;
exports.HotelRoomsService = HotelRoomsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IHotelRoomsRepository')),
    __param(1, (0, inversify_1.inject)('IAuthValidator')),
    __param(2, (0, inversify_1.inject)('IRoomValidator')),
    __metadata("design:paramtypes", [Object, Object, Object])
], HotelRoomsService);
