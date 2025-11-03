import z from "zod";
import { RoomsDTO, toRoomsDTO } from "../../core/DTO/hotel/roomsDTO.js";
import { IHotelRoomsService } from "../../core/interface/serivice/hotel/Ihotel.rooms.service.js";
import { logger } from "../../utils/logger.js";
import { singleUpload } from "../../utils/upload.cloudinary.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

@injectable()
export class HotelRoomsService implements IHotelRoomsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _roomsRepo: IHotelRoomsRepository
  ) { }

  async getAllRooms(hotelID: string): Promise<RoomsDTO[]> {
    const allData = await this._roomsRepo.findAllUser({ HotelId: hotelID }, {})
    return allData.map(toRoomsDTO)
  }

  async addRoom(data: RoomsDTO, file: Express.Multer.File[]): Promise<RoomsDTO> {
    const roomSchema = z.object({
      Facilities: z
        .string(),
      Capacity: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, {
          message: "Capacity must be a valid positive number",
        }),

      Description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters long" }),

      PricePerNight: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val >= 0, {
          message: "Price must be a valid non-negative number",
        }),

      RoomNumber: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
          message: "Room number must be a valid number",
        }),

      roomType: z
        .string()
        .min(2, { message: "Room type must be at least 2 characters long" }),
    });
    logger.info(data.Images)
    roomSchema.parse(data)
    let Image: string[] = []
    for (let img of file) {
      let url = await singleUpload(img, 'Travel-Travel-Document')
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
    const schema = z.object({
      id: z.string().min(10),
      status: z.enum(['Available', 'Maintance'])
    })
    schema.parse(data)
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
      Status: z.enum(["Available", "Unavailable", "Occupid"]),
      isBlocked: z.enum(["true", "false"])
    })
    const schema = z.string().length(24, "id must be a valid MongoDB ObjectId");
    schema.parse(id)
    logger.info(data)
    roomSchema.parse(data)
    let Image: string[] = []
    for (let img of files) {
      let url = await singleUpload(img, 'Travel-Travel-Document')
      Image.push(url)
    }
    const updatedRoom = await this._roomsRepo.update(id, {...data,Images:Image})
    if (updatedRoom) return toRoomsDTO(updatedRoom)
    throw new DataNotFoundError()
  }
}