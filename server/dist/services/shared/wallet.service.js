var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "inversify";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";
let WalletService = class WalletService {
    _walletRepo;
    _paymentValidator;
    _paymentUtils;
    constructor(_walletRepo, _paymentValidator, _paymentUtils) {
        this._walletRepo = _walletRepo;
        this._paymentValidator = _paymentValidator;
        this._paymentUtils = _paymentUtils;
    }
    async getWallet(id) {
        const wallet = await this._walletRepo.FindByUserId(id);
        logger.info(`wallet that found ${JSON.stringify(wallet)}`);
        if (wallet)
            return wallet;
        throw new DataNotFoundError();
    }
    async addMoney(paymentIntentId, amount, id) {
        await this._paymentValidator.addMoneyValidator(paymentIntentId, amount);
        logger.info('sneha');
        const verification = await this._paymentUtils.verifyPaymentIntent(paymentIntentId, amount);
        if (!verification.valid)
            return verification;
        const wallet = await this._walletRepo.FindByUserId(id);
        let saved;
        const transaction = {
            Type: 'credit',
            Amount: amount,
            Description: `${amount} Added by the user`,
            paymentIntentId: paymentIntentId,
            Date: new Date()
        };
        if (wallet) {
            wallet.Balance += amount;
            wallet.Transaction.push(transaction);
            logger.info(`wallet that updating ${wallet}`);
            saved = await this._walletRepo.update(wallet.id, wallet);
        }
        else {
            saved = await this._walletRepo.create({ UserId: id, Balance: amount, Transaction: [transaction] });
        }
        if (saved)
            return saved;
        throw new Data_Creation_Error();
    }
};
WalletService = __decorate([
    injectable(),
    __param(0, inject('IWalletRespository')),
    __param(1, inject('IPaymentValidator')),
    __param(2, inject('IPaymentUtils')),
    __metadata("design:paramtypes", [Object, Object, Object])
], WalletService);
export { WalletService };
