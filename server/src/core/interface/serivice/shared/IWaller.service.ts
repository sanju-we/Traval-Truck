import { WallterDTO } from "../../../../core/DTO/shared/wallet.dto.js";

export interface IWalletService{
  getWallet(id:string):Promise<WallterDTO>;
}