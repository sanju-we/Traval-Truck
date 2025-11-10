import { Request, Response } from "express";

export interface IAdminCouponController {
  getAll(req:Request,res:Response): Promise<void>;
  add(req:Request,res:Response):Promise<void>;
  update(req:Request,res:Response):Promise<void>;
  tongleStatus(req:Request,res:Response):Promise<void>;
}