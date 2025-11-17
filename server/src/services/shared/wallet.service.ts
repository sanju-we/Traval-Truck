import { WallterDTO } from "@core/DTO/shared/wallet.dto.js";
import { IWalletService } from "../../core/interface/serivice/shared/IWaller.service.js"
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository.js";
import { inject, injectable } from "inversify";

@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository
  ) { }
  async getWallet(id: string): Promise<WallterDTO> {
    const wallet = await this._walletRepo.FindByUserId(id)
    return wallet
  }
} 