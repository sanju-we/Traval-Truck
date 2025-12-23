import { Request, Response } from "express";

export interface IAgencyOrdersController {
  getAll(req:Request,res:Response):Promise<void>;
  getOrder(req:Request,res:Response):Promise<void>;
  setDate(req:Request,res:Response):Promise<void>;
  startTrip(req:Request,res:Response):Promise<void>;
  completeActivity(req:Request,res:Response):Promise<void>;
}