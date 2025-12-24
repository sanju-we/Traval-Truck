import { Request,Response } from "express";

export interface IHotelOrdersController {
  getAll(req:Request,res:Response):Promise<void>;
  getOrder(req:Request,res:Response):Promise<void>;
  updateCheckIn(req:Request,res:Response) :Promise<void>;
  updateCheckOut(req:Request,res:Response) : Promise<void>;
}