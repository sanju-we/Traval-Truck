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
        .string()
        .refine(
          (val) => {
            try {
              const parsed = JSON.parse(val);
              return Array.isArray(parsed) && parsed.every((item) => typeof item === "string");
            } catch {
              return false;
            }
          },
          { message: "Facilities must be a Characters" }
        )
        .transform((val) => JSON.parse(val)),

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
    roomSchema.parse(data)
    let Image: string[] = []
    for (let img of file) {
      let url = await singleUpload(img, 'Travel-Travel-Document')
      Image.push(url)
    }
    const createdData = await this._roomsRepo.create({ ...data, Images: Image,Status:'Available' })
    return toRoomsDTO(createdData)
  }

  async getRoom(id: string): Promise<RoomsDTO> {
    const schema =  z.string().min(10) 
    schema.parse(id)
    const room = await this._roomsRepo.findById(id);
    if (room) return toRoomsDTO(room)
    throw new DataNotFoundError()
  }
}