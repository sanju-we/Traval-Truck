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
import z from "zod";
import { toRoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { logger } from "../../utils/logger.js";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
let HotelRoomsService = class HotelRoomsService {
    _roomsRepo;
    _authValidator;
    _roomValidator;
    constructor(_roomsRepo, _authValidator, _roomValidator) {
        this._roomsRepo = _roomsRepo;
        this._authValidator = _authValidator;
        this._roomValidator = _roomValidator;
    }
    async getAllRooms(hotelID) {
        const allData = await this._roomsRepo.findAll({ HotelId: hotelID }, {});
        return allData.map(toRoomsDTO);
    }
    async addRoom(data, file) {
        await this._authValidator.RoomValidator(data);
        const Image = [];
        for (const img of file) {
            const url = await singleUpload(img, 'Travel-Travel-Document');
            Image.push(url);
        }
        const createdData = await this._roomsRepo.create({ ...data, Images: Image, Status: 'Available' });
        return toRoomsDTO(createdData);
    }
    async getRoom(id) {
        const schema = z.string().min(10);
        schema.parse(id);
        const room = await this._roomsRepo.findById(id);
        if (room)
            return toRoomsDTO(room);
        throw new DataNotFoundError();
    }
    async updateStatus(data) {
        await this._authValidator.updateStatusValidator(data.id, data.status);
        const update = await this._roomsRepo.update(data.id, { ['Status']: data.status });
        if (update)
            return toRoomsDTO(update);
        throw new DataNotFoundError();
    }
    async updateBlock(data) {
        const schema = z.object({
            id: z.string().min(10),
            status: z.boolean()
        });
        schema.parse(data);
        const update = await this._roomsRepo.update(data.id, { isBlocked: data.status });
        if (update)
            return toRoomsDTO(update);
        throw new DataNotFoundError();
    }
    async getEditRoom(id) {
        const schema = z.string().min(10);
        schema.parse(id);
        const room = await this._roomsRepo.findById(id);
        if (room)
            return toRoomsDTO(room);
        throw new DataNotFoundError();
    }
    async updateRoom(data, id, files) {
        await this._roomValidator.roomValidator(data);
        const Image = [];
        for (const img of files) {
            const url = await singleUpload(img, 'Travel-Travel-Document');
            Image.push(url);
        }
        const updatedRoom = await this._roomsRepo.update(id, { ...data, Images: Image });
        if (updatedRoom)
            return toRoomsDTO(updatedRoom);
        throw new DataNotFoundError();
    }
    async deleteSingleImage(id, index) {
        const room = await this._roomsRepo.findById(id);
        if (!room)
            throw new DataNotFoundError();
        const publicId = await extractPublicId(room.Images[index]);
        logger.info(`publidId ${publicId}`);
        const deleted = await deleteImage(publicId);
        if (!deleted)
            throw new DataNotFoundError();
        room.Images.splice(index, 1);
        await room.save();
        return toRoomsDTO(room);
    }
};
HotelRoomsService = __decorate([
    injectable(),
    __param(0, inject('IHotelRoomsRepository')),
    __param(1, inject('IAuthValidator')),
    __param(2, inject('IRoomValidator')),
    __metadata("design:paramtypes", [Object, Object, Object])
], HotelRoomsService);
export { HotelRoomsService };
