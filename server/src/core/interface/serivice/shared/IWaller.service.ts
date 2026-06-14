import { IWallet } from "../../../../core/interface/modelInterface/IWaller";
import { WallterDTO } from "../../../../core/DTO/shared/wallet.dto";

export interface IWalletService{
  getWallet(id:string, page?: number, limit?: number):Promise<WallterDTO>;
  getBalance(id:string) : Promise<{balance:number}>
  addMoney(paymentIntentId:string,amount:number,id:string):Promise<IWallet | {valid:boolean,message:string}>;
}