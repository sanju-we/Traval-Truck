import { Request,Response } from "express";

export interface IUserProfileController{
  profile(req:Request,res:Response):Promise<void>
}