import { Request, Response } from "express";

export interface IUserHotelsController{
  getAllHotels(req:Request,res:Response):Promise<void>;
  getRoom(req:Request,res:Response) :Promise<void>;
  purchaseRoom(req:Request,res:Response) :Promise<void>
}
