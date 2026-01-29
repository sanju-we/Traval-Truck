import { BaseRepository } from "../../repositories/baseRepository";
import { Wallet } from "../../models/Wallet";
import { toWalletDTO } from "../../core/DTO/shared/wallet.dto";
import { logger } from "../../utils/logger";
export class WalletRespository extends BaseRepository {
    constructor() {
        super(Wallet);
    }
    async FindByUserId(id) {
        const wallet = await Wallet.findOne({ UserId: id });
        logger.info(`wallet that found ${wallet}`);
        if (wallet)
            return toWalletDTO(wallet);
        return null;
    }
}
