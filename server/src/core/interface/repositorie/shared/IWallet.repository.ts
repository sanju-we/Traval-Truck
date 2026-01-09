import { PaginationResponse } from "../../../../core/DTO/pagination.DTO.js";
import { WallterDTO } from "../../../../core/DTO/shared/wallet.dto.js";
import { IWallet } from "../../../../core/interface/modelInterface/IWaller.js";
import { IBaserepository } from "../IBaseRepositories";

export interface IWalletRespository extends IBaserepository<IWallet> {
  FindByUserId(id: string): Promise<WallterDTO | null>;
  FindByUserIdWithPaginatin(id:string,currentPage:number,limit:number):Promise<PaginationResponse<IWallet>>
}