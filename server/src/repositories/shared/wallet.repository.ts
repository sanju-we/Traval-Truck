import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository";
import { BaseRepository } from "../../repositories/baseRepository";
import { IWallet } from "../../core/interface/modelInterface/IWaller";
import { Wallet } from "../../models/Wallet";
import { toWalletDTO, WallterDTO } from "../../core/DTO/shared/wallet.dto";
import { logger } from "../../utils/logger";

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