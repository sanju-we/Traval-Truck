import { Request, Response } from "express";

export interface IRestaurantFoodController {
  getAllFoods(req:Request,res:Response):Promise<void>;
  addFood(req:Request,res:Response):Promise<void>;
  update(req:Request,res:Response):Promise<void>;
  deleteImage(req:Request,res:Response):Promise<void>;
}