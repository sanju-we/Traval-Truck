import { IWallet } from "../../../../core/interface/modelInterface/IWaller.js";
import { WallterDTO } from "../../../../core/DTO/shared/wallet.dto.js";
import { PaginationResponse } from "../../../../core/DTO/pagination.DTO.js";

export interface IWalletService{
  getWallet(id:string,currentPage:number):Promise<PaginationResponse<IWallet>>;
  addMoney(paymentIntentId:string,amount:number,id:string):Promise<IWallet | {valid:boolean,message:string}>;
}