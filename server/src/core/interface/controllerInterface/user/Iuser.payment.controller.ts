import { Request, Response } from "express";

export interface IUserPaymentController {
  createPayment(req:Request,res:Response):Promise<void>;
}