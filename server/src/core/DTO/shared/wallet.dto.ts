import { IWallet } from "../../../core/interface/modelInterface/IWaller";


interface transactions{
  Type:string,
  Amount:number,
  Description:string,
  paymentIntentId?:string
  Date:Date
}

export interface WallterDTO{
  id:string,
  Transaction:transactions[],
  Balance:number,
}

export const toWalletDTO = (wallet:IWallet):WallterDTO => ({
  id:wallet._id.toString(),
  Transaction : wallet.Transaction,
  Balance:wallet.Balance,
})