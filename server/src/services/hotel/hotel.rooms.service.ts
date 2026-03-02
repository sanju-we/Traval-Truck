import { RoomsDTO, toRoomsDTO } from "../../core/DTO/hotel/roomsDTO";
import { IRoomType, IRoomsDocument } from "../../core/interface/modelInterface/IRoomType";
import { IHotelRoomsService } from "../../core/interface/serivice/hotel/Ihotel.rooms.service";
import { logger } from "../../utils/logger";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors";
import { IAuthValidator } from "../../core/interface/validator/Iauth.validator";
import { IRoomValidator } from "../../core/interface/validator/Iroom.validator";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator";
import { PaginationResponse } from "@core/DTO/pagination.DTO";
import mongoose from "mongoose";

@injectable()
export class HotelRoomsService implements IHotelRoomsService {
  constructor(
    @inject('IHotelRoomsRepository') private readonly _roomsRepo: IHotelRoomsRepository,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator,
    @inject('IRoomValidator') private readonly _roomValidator: IRoomValidator,
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
  ) { }

  async getAllRooms(hotelID: string, page: number, search: number, Description: string): Promise<PaginationResponse<RoomsDTO>> {
    const allData = await this._roomsRepo.findAllPackageWithPartners(page, Description, 5, search, hotelID)
    return allData
  }

  async addRoom(data: RoomsDTO, file: Express.Multer.File[]): Promise<RoomsDTO> {
    await this._authValidator.RoomValidator(data)
    const Image: string[] = []
    for (const img of file) {
      const url = await singleUpload(img, 'Travel-Travel-Document')
      Image.push(url)
    }
    console.log('datasssssss', data)
    const { images, id: _id, AvailableCount, CreatedAt, HotelId, ...rest } = data;
    const createData = {
      ...rest,
      HotelId: new mongoose.Types.ObjectId(HotelId),
      Images: Image,
      Status: 'Available',
      AvailableCount,
      createdAt: CreatedAt
    } as unknown as Partial<IRoomType>;
    const createdData = await this._roomsRepo.create(createData)
    return toRoomsDTO(createdData)
  }

  async getRoom(id: string): Promise<RoomsDTO> {
    this._baseValidator.idValidator(id);
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

    this._authValidator.blockValidator(data.id, data.status)
    const update = await this._roomsRepo.update(data.id, { isBlocked: data.status })
    if (update) return toRoomsDTO(update)
    throw new DataNotFoundError()
  }

  async getEditRoom(id: string): Promise<RoomsDTO> {
    this._baseValidator.idValidator(id);
    const room = await this._roomsRepo.findById(id)
    if (room) return toRoomsDTO(room)
    throw new DataNotFoundError()
  }

  async updateRoom(data: Partial<RoomsDTO>, id: string, files: Express.Multer.File[]): Promise<RoomsDTO> {
    console.log(data);
    await this._roomValidator.roomValidator(data)
    const room = await this._roomsRepo.findById(id);
    if (!room) throw new DataNotFoundError();
    if (!room.Images) throw new DataNotFoundError();
    const Image: string[] = room.Images
    for (const img of files) {
      const url = await singleUpload(img, 'Travel-Travel-Document')
      Image.push(url)
    }
    const { images, id: _id, AvailableCount, CreatedAt, HotelId, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest, Images: Image };

    if (HotelId) {
      updateData.HotelId = new mongoose.Types.ObjectId(HotelId);
    }
    if (AvailableCount !== undefined) {
      updateData.AvailableCount = AvailableCount;
    }
    if (CreatedAt) {
      updateData.createdAt = CreatedAt;
    }

    const updatedRoom = await this._roomsRepo.update(id, updateData as unknown as Partial<IRoomType>)
    if (updatedRoom) return toRoomsDTO(updatedRoom)
    throw new DataNotFoundError()
  }

  async deleteSingleImage(id: string, index: number): Promise<RoomsDTO> {
    const room = await this._roomsRepo.findById(id);
    if (!room) throw new DataNotFoundError()
    if (!room.Images) throw new DataNotFoundError();
    const publicId = await extractPublicId(room.Images[index]);
    logger.info(`publidId ${publicId}`)
    const deleted = await deleteImage(publicId);
    if (!deleted) throw new DataNotFoundError()
    room.Images.splice(index, 1);
    await room.save()
    return toRoomsDTO(room)
  }
}