"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSubsctiptionHistoryDTO = void 0;
const toSubsctiptionHistoryDTO = (history) => {
    const hist = history;
    return {
        userId: hist.userId,
        role: hist.role,
        amount: hist.amount,
        paymentId: hist.paymentId,
        subscriptionId: hist.subscriptionId,
        status: hist.status,
        startDate: hist.startDate,
        endDate: hist.endDate,
        name: hist.name,
        features: hist.features,
        valid: hist.valid,
    };
};
exports.toSubsctiptionHistoryDTO = toSubsctiptionHistoryDTO;
