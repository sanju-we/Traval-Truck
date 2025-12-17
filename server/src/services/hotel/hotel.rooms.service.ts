import z from "zod";
import { RoomsDTO, toRoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { IHotelRoomsService } from "../../core/interface/serivice/hotel/Ihotel.rooms.service.js";
import { logger } from "../../utils/logger.js";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { IAuthValidator } from "../../core/interface/validator/Iauth.validator.js";

@injectable()
export class HotelRoomsService implements IHotelRoomsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _roomsRepo: IHotelRoomsRepository,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator
  ) { }

  async getAllRooms(hotelID: string): Promise<RoomsDTO[]> {
    const allData = await this._roomsRepo.findAll({ HotelId: hotelID }, {})
    return allData.map(toRoomsDTO)
  }

  async addRoom(data: RoomsDTO, file: Express.Multer.File[]): Promise<RoomsDTO> {
    await this._authValidator.RoomValidator(data)
    logger.info(data.Images)
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
    const roomSchema = z.object({
      Capacity: z.string().regex(/^\d+$/, "Capacity must be a numeric string"),
      Description: z.string().min(1, "Description is required").min(1, "At least one facility is required"),
      Facilities: z.array(z.string().min(1, "Facility name cannot be empty")),
      PricePerNight: z.string().regex(/^\d+$/, "PricePerNight must be a numeric string"),
      RoomNumber: z.string().regex(/^\d+$/, "RoomNumber must be a numeric string"),
      Status: z.enum(["Available", "Occupid","Maintance"]),
      isBlocked: z.enum(["true", "false"])
    })
    const schema = z.string().length(24, "id must be a valid MongoDB ObjectId");
    schema.parse(id)
    logger.info(data)
    roomSchema.parse(data)
    const Image: string[] = []
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
    if(!deleted) throw new DataNotFoundError()
    room.Images.splice(index,1);
    await room.save()
    return toRoomsDTO(room)
  }
}