"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
let WalletService = class WalletService {
    constructor(_walletRepo, _paymentValidator, _paymentUtils) {
        this._walletRepo = _walletRepo;
        this._paymentValidator = _paymentValidator;
        this._paymentUtils = _paymentUtils;
    }
    async getWallet(id) {
        const wallet = await this._walletRepo.FindByUserId(id);
        if (!wallet)
            throw new resAndErrors_1.DataNotFoundError();
        return wallet;
    }
    async initiateAddMoney(amount, userId) {
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
    async addMoney(userId, amount, paymentId) {
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
            if (isSaved)
                return isSaved;
        }
        return await this._walletRepo.create({
            UserId: userId,
            Balance: amount,
            Transaction: [transaction],
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IWalletRespository')),
    __param(1, (0, inversify_1.inject)('IPaymentValidator')),
    __param(2, (0, inversify_1.inject)('IPaymentUtils')),
    __metadata("design:paramtypes", [Object, Object, Object])
], WalletService);
