import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository";
import { BaseRepository } from "../../repositories/baseRepository";
import { IWallet } from "../../core/interface/modelInterface/IWaller";
import { Wallet } from "../../models/Wallet";
import { toWalletDTO, WallterDTO } from "../../core/DTO/shared/wallet.dto";
import { logger } from "../../utils/logger";
import mongoose from "mongoose";

export class WalletRespository extends BaseRepository<IWallet> implements IWalletRespository {
  constructor() {
    super(Wallet)
  }

  async FindByUserId(id: string, page?: number, limit?: number): Promise<WallterDTO | null> {
    if (page === undefined || limit === undefined) {
      const wallet = await Wallet.findOne({ UserId : id })
      logger.info(`wallet that found ${wallet}`)
      if (wallet) return toWalletDTO(wallet)
      return null
    }

    const skip = (page - 1) * limit;

    const results = await Wallet.aggregate([
      { $match: { UserId: new mongoose.Types.ObjectId(id) } },
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

    const dto = toWalletDTO({
      _id: aggregated._id,
      UserId: aggregated.UserId,
      role: aggregated.role,
      Balance: aggregated.Balance,
      Transaction: aggregated.Transaction,
    } as unknown as IWallet);

    dto.page = page;
    dto.totalPages = totalPages;
    dto.totalTransactions = totalTransactions;

    return dto;
  }
}