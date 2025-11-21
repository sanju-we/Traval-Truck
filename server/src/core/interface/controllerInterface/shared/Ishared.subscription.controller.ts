import { Request, Response } from "express";

export interface ISharedSubscriptionController{
  getAll(req:Request,res:Response):Promise<void>;
  getCurrent(req:Request,res:Response):Promise<void>;
  getCoupon(req:Request,res:Response):Promise<void>;
  purchaseSubscription(req:Request,res:Response):Promise<void>;
}