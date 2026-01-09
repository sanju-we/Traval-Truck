import { Request,Response } from "express"

export interface IUserMindMapController {
  create(req:Request,res:Response):Promise<void>;
  getmap(req:Request,res:Response):Promise<void>;
  mindMap(req:Request,res:Response):Promise<void>;
  confirmMap(req:Request,res:Response):Promise<void>;
}