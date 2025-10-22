import { Request,Response } from "express";

export interface IAdminSubscriptionController {
  addSubscription(req:Request,res:Response) : Promise<void>;
  getAll(req:Request,res:Response) : Promise<void>;
  updateSubscription(req:Request,res:Response) : Promise<void>;
  tonggleStatus(req:Request,res:Response) : Promise<void>;
}