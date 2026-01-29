"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRespository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Wallet_1 = require("../../models/Wallet");
const wallet_dto_1 = require("../../core/DTO/shared/wallet.dto");
const logger_1 = require("../../utils/logger");
class WalletRespository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Wallet_1.Wallet);
    }
    async FindByUserId(id) {
        const wallet = await Wallet_1.Wallet.findOne({ UserId: id });
        logger_1.logger.info(`wallet that found ${wallet}`);
        if (wallet)
            return (0, wallet_dto_1.toWalletDTO)(wallet);
        return null;
    }
}
exports.WalletRespository = WalletRespository;
