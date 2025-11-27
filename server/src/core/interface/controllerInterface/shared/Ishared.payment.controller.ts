import { Request, Response } from "express";

export interface IPaymentController {
  initiate(req:Request,res:Response):Promise<void>;
}