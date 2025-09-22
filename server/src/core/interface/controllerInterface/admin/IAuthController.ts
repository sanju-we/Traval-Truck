import { Response,Request } from "express";

export interface IController
{
  login(req:Request,res:Response):Promise<void>;
  logout(req:Request,res:Response):Promise<void>;
}