import { Request, Response } from "express";

export interface IUserTripController {
  getHistory(req:Request,res:Response):Promise<void>;
}