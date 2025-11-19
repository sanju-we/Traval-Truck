import { BaseRepository } from "../../repositories/baseRepository.js";
import { Wallet } from "../../models/Wallet.js";
import { toWalletDTO } from "../../core/DTO/shared/wallet.dto.js";
import { logger } from "../../utils/logger.js";
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
