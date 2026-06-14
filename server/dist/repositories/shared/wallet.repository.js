"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRespository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Wallet_1 = require("../../models/Wallet");
const wallet_dto_1 = require("../../core/DTO/shared/wallet.dto");
const logger_1 = require("../../utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
class WalletRespository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Wallet_1.Wallet);
    }
    async FindByUserId(id, page, limit) {
        if (page === undefined || limit === undefined) {
            const wallet = await Wallet_1.Wallet.findOne({ UserId: id });
            logger_1.logger.info(`wallet that found ${wallet}`);
            if (wallet)
                return (0, wallet_dto_1.toWalletDTO)(wallet);
            return null;
        }
        const skip = (page - 1) * limit;
        const results = await Wallet_1.Wallet.aggregate([
            { $match: { UserId: new mongoose_1.default.Types.ObjectId(id) } },
            {
                $project: {
                    _id: 1,
                    Balance: 1,
                    role: 1,
                    UserId: 1,
                    totalTransactions: { $size: { $ifNull: ["$Transaction", []] } },
                    Transaction: {
                        $slice: [
                            {
                                $sortArray: {
                                    input: { $ifNull: ["$Transaction", []] },
                                    sortBy: { Date: -1 }
                                }
                            },
                            skip,
                            limit
                        ]
                    }
                }
            }
        ]);
        if (!results || results.length === 0) {
            return null;
        }
        const aggregated = results[0];
        const totalTransactions = aggregated.totalTransactions || 0;
        const totalPages = Math.ceil(totalTransactions / limit);
        const dto = (0, wallet_dto_1.toWalletDTO)({
            _id: aggregated._id,
            UserId: aggregated.UserId,
            role: aggregated.role,
            Balance: aggregated.Balance,
            Transaction: aggregated.Transaction,
        });
        dto.page = page;
        dto.totalPages = totalPages;
        dto.totalTransactions = totalTransactions;
        return dto;
    }
}
exports.WalletRespository = WalletRespository;
