import { Request,Response } from "express";

export interface IHotelOrdersController {
  getAll(req:Request,res:Response):Promise<void>;
}