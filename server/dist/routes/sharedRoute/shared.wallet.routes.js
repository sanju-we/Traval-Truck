"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const walletRouter = (0, express_1.Router)();
const WalletController = container_1.container.get('ISharedWalletController');
walletRouter.get("/", (0, asyncHandler_1.asyncHandler)(WalletController.getWallet.bind(WalletController)))
    .get('/balance', (0, asyncHandler_1.asyncHandler)(WalletController.getBalance.bind(WalletController)))
    .post('/add-money', (0, asyncHandler_1.asyncHandler)(WalletController.addMoney.bind(WalletController)));
exports.default = walletRouter;
