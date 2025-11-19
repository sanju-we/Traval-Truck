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
import { logger } from "../../utils/logger.js";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
let SharedWalletController = class SharedWalletController {
    _walletService;
    constructor(_walletService) {
        this._walletService = _walletService;
    }
    async getWallet(req, res) {
        const id = req.user.id;
        const wallet = await this._walletService.getWallet(id);
        logger.info(wallet);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, wallet);
    }
    async addMoney(req, res) {
        const { paymentIntentId, amount } = req.body;
        const id = req.user.id;
        const wallet = await this._walletService.addMoney(paymentIntentId, amount, id);
        logger.info(wallet);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS, wallet);
    }
};
SharedWalletController = __decorate([
    injectable(),
    __param(0, inject('IWalletService')),
    __metadata("design:paramtypes", [Object])
], SharedWalletController);
export { SharedWalletController };
