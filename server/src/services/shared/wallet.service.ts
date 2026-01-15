import { toWalletDTO, WallterDTO } from "@core/DTO/shared/wallet.dto";
import { IWalletService } from "../../core/interface/serivice/shared/IWaller.service"
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository";
import { inject, injectable } from "inversify";
import { IPaymentValidator } from "../../core/interface/validator/Ipayment.validator";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors";
import { IWallet } from "../../core/interface/modelInterface/IWaller";
import { logger } from "../../utils/logger";

@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository,
    @inject('IPaymentValidator') private readonly _paymentValidator: IPaymentValidator,
    @inject('IPaymentUtils') private readonly _paymentUtils: IPaymentUtils
  ) { }

  async getWallet(id: string): Promise<WallterDTO> {
    const wallet = await this._walletRepo.FindByUserId(id);
    if (!wallet) throw new DataNotFoundError();
    return wallet;
  }

  async initiateAddMoney(amount: number, userId: string): Promise<{ url: string; sessionId: string }> {
    // await this._paymentValidator.addMoneyValidator(amount);

    return this._paymentUtils.createCheckoutSession({
      amount,
      currency: "inr",
      description: `Add money to wallet`,
      successUrl: `${process.env.FRONTEND_URL}/wallet/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/wallet/cancel`,
      metadata: {
        type: "wallet_topup",
        userId,
        amount: amount.toString(),
      },
    });
  }

  // ⚠️ This function is called ONLY from the Stripe webhook
  async addMoney(userId: string, amount: number, paymentId: string): Promise<IWallet> {
    const wallet = await this._walletRepo.FindByUserId(userId);
    const transaction = {
      Type: 'credit',
      Amount: amount,
      Description: `${amount} added via Stripe`,
      paymentIntentId: paymentId,
      Date: new Date()
    };

    if (wallet) {
      wallet.Balance += amount;
      wallet.Transaction.push(transaction);
      const isSaved = await this._walletRepo.update(wallet.id, wallet);
      if(isSaved) return isSaved
    }

    return await this._walletRepo.create({
      UserId: userId,
      Balance: amount,
      Transaction: [transaction],
    });
  }
}