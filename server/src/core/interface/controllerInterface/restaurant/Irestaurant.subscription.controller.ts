import { subscriptionDTO } from "../../../../core/DTO/subscription.dto";
import { Request, Response } from "express";

export interface IRestaurantSubscriptionController{
  getAll(req:Request,res:Response):Promise<void>
}
