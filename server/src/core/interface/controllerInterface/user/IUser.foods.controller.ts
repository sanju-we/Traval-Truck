import { Request,Response } from "express";

export interface IUserFoodsController {
  getAll(req:Request,res:Response):Promise<void>;
}