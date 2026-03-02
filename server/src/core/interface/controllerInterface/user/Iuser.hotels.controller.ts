import { Request, Response } from "express";

export interface IUserHotelsController {
  getAllHotels(req: Request, res: Response): Promise<void>;
  getRoom(req: Request, res: Response): Promise<void>;
  getRoomsByHotel(req: Request, res: Response): Promise<void>;
  getHotelDetails(req: Request, res: Response): Promise<void>;
  purchaseRoom(req: Request, res: Response): Promise<void>
}
