import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { IWallet } from "../../core/interface/modelInterface/IWaller";
import { Wallet } from "../../models/Wallet.js";
import { toWalletDTO, WallterDTO } from "../../core/DTO/shared/wallet.dto.js";
import { logger } from "../../utils/logger.js";

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
}