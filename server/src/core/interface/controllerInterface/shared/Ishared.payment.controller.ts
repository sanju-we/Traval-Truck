import { Request, Response } from "express";

export interface IPaymentController {
  createPayment(req:Request,res:Response):Promise<void>;
}