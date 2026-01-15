import z from "zod";
import { RoomsDTO, toRoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { IHotelRoomsService } from "../../core/interface/serivice/hotel/Ihotel.rooms.service.js";
import { logger } from "../../utils/logger.js";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { IAuthValidator } from "../../core/interface/validator/Iauth.validator.js";
import { IRoomValidator } from "../../core/interface/validator/Iroom.validator.js";
import { PaginationResponse } from "@core/DTO/pagination.DTO.js";

@injectable()
export class HotelRoomsService implements IHotelRoomsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _roomsRepo: IHotelRoomsRepository,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator,
    @inject('IRoomValidator') private readonly _roomValidator: IRoomValidator,
  ) { }

  async getAllRooms(hotelID: string, page: number, search: number, Description: string): Promise<PaginationResponse<RoomsDTO>> {
    const allData = await this._roomsRepo.findAllPackageWithPartners(page,Description,5,search,hotelID)
    return allData
  }

  async addRoom(data: RoomsDTO, file: Express.Multer.File[]): Promise<RoomsDTO> {
    await this._authValidator.RoomValidator(data)
    const Image: string[] = []
    for (const img of file) {
      const url = await singleUpload(img, 'Travel-Travel-Document')
      Image.push(url)
    }
    const createdData = await this._roomsRepo.create({ ...data, Images: Image, Status: 'Available' })
    return toRoomsDTO(createdData)
  }

  async getRoom(id: string): Promise<RoomsDTO> {
    const schema = z.string().min(10)
    schema.parse(id)
    const room = await this._roomsRepo.findById(id);
    if (room) return toRoomsDTO(room)
    throw new DataNotFoundError()
  }

  async updateStatus(data: { id: string, status: string }): Promise<RoomsDTO> {

    await this._authValidator.updateStatusValidator(data.id, data.status)
    const update = await this._roomsRepo.update(data.id, { ['Status']: data.status })
    if (update) return toRoomsDTO(update)
    throw new DataNotFoundError()
  }

  async updateBlock(data: { id: string; status: boolean; }): Promise<RoomsDTO> {
    const schema = z.object({
      id: z.string().min(10),
      status: z.boolean()
    })
    schema.parse(data)
    const update = await this._roomsRepo.update(data.id, { isBlocked: data.status })
    if (update) return toRoomsDTO(update)
    throw new DataNotFoundError()
  }

  async getEditRoom(id: string): Promise<RoomsDTO> {
    const schema = z.string().min(10)
    schema.parse(id)
    const room = await this._roomsRepo.findById(id)
    if (room) return toRoomsDTO(room)
    throw new DataNotFoundError()
  }

  async updateRoom(data: Partial<RoomsDTO>, id: string, files: Express.Multer.File[]): Promise<RoomsDTO> {
    console.log(data);
    await this._roomValidator.roomValidator(data)
    const room = await this._roomsRepo.findById(id);
    if (!room) throw new DataNotFoundError();
    const Image: string[] = room.Images
    for (const img of files) {
      const url = await singleUpload(img, 'Travel-Travel-Document')
      Image.push(url)
    }
    const updatedRoom = await this._roomsRepo.update(id, { ...data, Images: Image })
    if (updatedRoom) return toRoomsDTO(updatedRoom)
    throw new DataNotFoundError()
  }

  async deleteSingleImage(id: string, index: number): Promise<RoomsDTO> {
    const room = await this._roomsRepo.findById(id);
    if (!room) throw new DataNotFoundError()
    const publicId = await extractPublicId(room.Images[index]);
    logger.info(`publidId ${publicId}`)
    const deleted = await deleteImage(publicId);
    if (!deleted) throw new DataNotFoundError()
    room.Images.splice(index, 1);
    await room.save()
    return toRoomsDTO(room)
  }
}