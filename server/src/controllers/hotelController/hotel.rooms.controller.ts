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
    const page = req.query.Description as string
    const search = req.query.Description as string
    const Description = req.query.Description as string
    const roomNum = isNaN(Number(search)) ? 0 : Number(search)
    const pageNum = isNaN(Number(page)) ? 0 : Number(page) 
    const allRooms = await this._roomService.getAllRooms(hotelID,pageNum,roomNum,Description)
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
    const addedData = await this._roomService.addRoom({ ...data, HotelId: hotelId }, allFiles)
    if (addedData) return sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, addedData)
    throw new Data_Creation_Error()
  }

  async getRoom(req: Request, res: Response): Promise<void> {
    const roomId = req.params.id
    const room = await this._roomService.getRoom(roomId)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, room)
  }

  async updateRoomStatus(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const updatedData = await this._roomService.updateStatus(data)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedData)
  }

  async updateBlock(req: Request, res: Response): Promise<void> {
    const data = req.body
    const updateData = await this._roomService.updateBlock(data)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateData)
  }

  async getEditRoom(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const updatedRoom = await this._roomService.getEditRoom(id)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, updatedRoom)
  }

  async updateRoom(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const id = req.params.id
    const files = req.files 
    if (!files) throw new Files_Missing();
    logger.info(files)
    const allFiles: Express.Multer.File[] = Object.values(files).flat();
    const updatedRoom = await this._roomService.updateRoom(data,id,allFiles)
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,updatedRoom)
  }

  async deleteSingleImage(req: Request, res: Response): Promise<void> {
      const index = req.body.index;
      const id = req.params.id;
      const updated = await this._roomService.deleteSingleImage(id,index)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DELETED,updated);
  }
}