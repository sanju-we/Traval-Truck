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
exports.SharedWalletController = void 0;
const logger_1 = require("../../utils/logger");
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let SharedWalletController = class SharedWalletController {
    constructor(_walletService) {
        this._walletService = _walletService;
    }
    async getWallet(req, res) {
        const id = req.user.id;
        const wallet = await this._walletService.getWallet(id);
        logger_1.logger.info(wallet);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, wallet);
    }
    async addMoney(req, res) {
        const { paymentIntentId, amount } = req.body;
        const id = req.user.id;
        const wallet = await this._walletService.addMoney(id, amount, paymentIntentId);
        logger_1.logger.info(wallet);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.PAYMENT_SUCCESS, wallet);
    }
};
exports.SharedWalletController = SharedWalletController;
exports.SharedWalletController = SharedWalletController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IWalletService')),
    __metadata("design:paramtypes", [Object])
], SharedWalletController);
