import { Request,Response } from "express";

export interface ISharedWalletController {
  getWallet(req:Request,res:Response):Promise<void>;
}