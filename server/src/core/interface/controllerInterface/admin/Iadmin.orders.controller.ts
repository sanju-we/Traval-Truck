import { Request, Response } from "express";

export interface IAdminOrderController {
  getAllOrders(req:Request,res:Response):Promise<void>;
}