import { Request,Response } from "express"

export interface IUserMindMapController {
  create(req:Request,res:Response):Promise<void>;
}