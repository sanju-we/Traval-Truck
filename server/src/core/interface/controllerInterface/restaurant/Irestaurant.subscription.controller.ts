import { subscriptionDTO } from "../../../../core/DTO/subscription.dto.js";
import { Request, Response } from "express";

export interface IRestaurantSubscriptionController{
  getAll(req:Request,res:Response):Promise<void>
}
