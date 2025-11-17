import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { IWallet } from "../../core/interface/modelInterface/IWaller";
import { Wallet } from "../../models/Wallet.js";
import { toWalletDTO, WallterDTO } from "../../core/DTO/shared/wallet.dto.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

export class WalletRespository extends BaseRepository<IWallet> implements IWalletRespository {
  constructor() {
    super(Wallet)
  }

  async FindByUserId(id: string): Promise<WallterDTO> {
    const wallet = await Wallet.findOne({ userId: id })
    if (wallet) return toWalletDTO(wallet)
    throw new DataNotFoundError()
  }
}