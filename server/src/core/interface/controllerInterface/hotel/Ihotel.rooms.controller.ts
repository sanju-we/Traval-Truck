import { Request, Response } from "express";

export interface IHotelRoomsController{
  rooms(req:Request,res:Response):Promise<void>;
  getRoom(req:Request,res:Response):Promise<void>;
  addRooms(req:Request,res:Response):Promise<void>;
  updateRoomStatus(req:Request,res:Response):Promise<void>;
  updateBlock(req:Request,res:Response):Promise<void>;
  getEditRoom(req:Request,res:Response):Promise<void>;
  updateRoom(req:Request,res:Response):Promise<void>;
}