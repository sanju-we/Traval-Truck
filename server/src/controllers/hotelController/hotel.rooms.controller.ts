import { Request, Response } from "express";
import { IHotelRoomsController } from "../../core/interface/controllerInterface/hotel/Ihotel.rooms.controller.js";
import { IHotelRoomsService } from "../../core/interface/serivice/hotel/Ihotel.rooms.service.js";
import { inject, injectable } from "inversify";
import { logger } from "../../utils/logger.js";
import { Data_Creation_Error, DataNotFoundError, Files_Missing, sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class HotelRoomsController implements IHotelRoomsController {
  constructor(
    @inject('IHotelRoomsService') private readonly _roomService: IHotelRoomsService
  ) { }

  async rooms(req: Request, res: Response): Promise<void> {
    const hotelID = req.user.id
    const allRooms = await this._roomService.getAllRooms(hotelID)
    logger.info(allRooms)
    if (allRooms) return sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allRooms)
    throw new DataNotFoundError()
  }

  async addRooms(req: Request, res: Response): Promise<void> {
    const data = req.body
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[]
    }
    const hotelId = req.user.id
    if (!files || Object.keys(files).length === 0) throw new Files_Missing();
    const allFiles: Express.Multer.File[] = Object.values(files).flat();
    const addedData = await this._roomService.addRoom({...data,HotelId:hotelId}, allFiles)
    if (addedData) return sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, addedData)
    throw new Data_Creation_Error()
  }

  async getRoom(req: Request, res: Response): Promise<void> {
    const roomId = req.params.id
      const room = await this._roomService.getRoom(roomId)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.SUCCESS,room)
  }
}