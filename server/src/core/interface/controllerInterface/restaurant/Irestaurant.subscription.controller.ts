import { Request, Response } from "express";

export interface IRestaurantSubscriptionController{
  getAll(req:Request,res:Response):Promise<void>
}
