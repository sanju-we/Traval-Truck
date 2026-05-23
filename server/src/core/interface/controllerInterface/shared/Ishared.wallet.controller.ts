import { Request,Response } from "express";

export interface ISharedWalletController {
  getWallet(req:Request,res:Response):Promise<void>;
  getBalance(req:Request,res:Response):Promise<void>;
  addMoney(req:Request,res:Response):Promise<void>;
}