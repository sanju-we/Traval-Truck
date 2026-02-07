"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWalletDTO = void 0;
const toWalletDTO = (wallet) => ({
    id: wallet._id.toString(),
    Transaction: wallet.Transaction,
    Balance: wallet.Balance,
});
exports.toWalletDTO = toWalletDTO;
