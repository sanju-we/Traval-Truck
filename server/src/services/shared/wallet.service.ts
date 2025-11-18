import { toWalletDTO, WallterDTO } from "@core/DTO/shared/wallet.dto.js";
import { IWalletService } from "../../core/interface/serivice/shared/IWaller.service.js"
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository.js";
import { inject, injectable } from "inversify";
import { IPaymentValidator } from "../../core/interface/validator/Ipayment.validator.js";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils.js";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { IWallet } from "../../core/interface/modelInterface/IWaller.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository,
    @inject('IPaymentValidator') private readonly _paymentValidator : IPaymentValidator,
    @inject('IPaymentUtils') private readonly _paymentUtils : IPaymentUtils
  ) { }
  async getWallet(id: string): Promise<WallterDTO> {
    const wallet = await this._walletRepo.FindByUserId(id)
    logger.info(`wallet that found ${JSON.stringify(wallet)}`)
    if(wallet) return wallet
    throw new DataNotFoundError()
  }

  async addMoney(paymentIntentId: string, amount: number,id:string): Promise<IWallet | {valid:boolean,message:string}> {
    await this._paymentValidator.addMoneyValidator(paymentIntentId,amount);
    logger.info('sneha')
    const verification = await this._paymentUtils.verifyPaymentIntent(paymentIntentId,amount);
      if(!verification.valid) return verification
      const wallet = await this._walletRepo.FindByUserId(id);
      let saved;
      const transaction = {
        Type:'credit',
        Amount:amount,
        Description: `${amount} Added by the user`,
        paymentIntentId:paymentIntentId,
        Date: new Date()
      }
      if(wallet){
        wallet.Balance+= amount;
        wallet.Transaction.push(transaction);
        logger.info(`wallet that updating ${wallet}`)
        saved = await this._walletRepo.update(wallet.id,wallet)
      }else{
        saved = await this._walletRepo.create({UserId:id,Balance:amount,Transaction:[transaction]})
      }
      if(saved) return saved
      throw new Data_Creation_Error()
  }
} 