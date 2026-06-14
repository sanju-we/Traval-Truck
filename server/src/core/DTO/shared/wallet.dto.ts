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
  page?:number,
  totalPages?:number,
  totalTransactions?:number,
}

export const toWalletDTO = (wallet:IWallet & { page?: number; totalPages?: number; totalTransactions?: number }):WallterDTO => ({
  id:wallet._id.toString(),
  Transaction : wallet.Transaction,
  Balance:wallet.Balance,
  page: wallet.page,
  totalPages: wallet.totalPages,
  totalTransactions: wallet.totalTransactions,
})