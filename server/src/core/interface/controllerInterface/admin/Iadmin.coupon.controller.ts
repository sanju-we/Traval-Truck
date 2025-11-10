import { Request, Response } from "express";

export interface IAdminCouponController {
  getAll(req:Request,res:Response): Promise<void>;
  add(req:Request,res:Response):Promise<void>;
}