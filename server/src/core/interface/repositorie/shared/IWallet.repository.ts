import { WallterDTO } from "../../../../core/DTO/shared/wallet.dto";
import { IWallet } from "../../../../core/interface/modelInterface/IWaller";
import { IBaserepository } from "../IBaseRepositories";

export interface IWalletRespository extends IBaserepository<IWallet> {
  FindByUserId(id: string, page?: number, limit?: number): Promise<WallterDTO | null>;
}