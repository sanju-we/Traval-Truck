import { Request, Response } from "express";

export interface IUserTripController {
  getHistory(req:Request,res:Response):Promise<void>;
  getOrder(req:Request,res:Response):Promise<void>;
  orderCalcellation(req:Request,res:Response):Promise<void>;
}