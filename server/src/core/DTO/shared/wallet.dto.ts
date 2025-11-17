import { IWallet } from "../../../core/interface/modelInterface/IWaller.js";


interface transactions{
  Type:string,
  Amount:number,
  Description:string,
  Date:Date
}

export interface WallterDTO{
  id:string,
  transaction:transactions[],
  balance:number
}

export const toWalletDTO = (wallet:IWallet):WallterDTO => ({
  id:wallet._id.toString(),
  transaction : wallet.transacion,
  balance:wallet.Balance
})