import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { IWallet } from "../../core/interface/modelInterface/IWaller";
import { Wallet } from "../../models/Wallet.js";
import { toWalletDTO, WallterDTO } from "../../core/DTO/shared/wallet.dto.js";
import { logger } from "../../utils/logger.js";
import { PaginationResponse } from "../../core/DTO/pagination.DTO.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

export class WalletRespository extends BaseRepository<IWallet> implements IWalletRespository {
  constructor() {
    super(Wallet)
  }

  async FindByUserId(id: string): Promise<WallterDTO | null> {
    const wallet = await Wallet.findOne({ UserId : id })
    logger.info(`wallet that found ${wallet}`)
    if (wallet) return toWalletDTO(wallet)
    return null
  }

  async FindByUserIdWithPaginatin(id: string, currentPage: number, limit: number): Promise<PaginationResponse<IWallet>> {
    const skip = (currentPage+1)*limit
    const wallet = await Wallet.find({UserId:id}).lean<IWallet[]>().skip(skip).limit(limit)
    const totalCount = await Wallet.countDocuments({UserId:id});
    const totalPages = Math.ceil(totalCount/limit)
    if(!wallet) throw new DataNotFoundError()
    return {
      data:wallet,
      totalPage:totalPages,
      totalCount
    }
  }
}