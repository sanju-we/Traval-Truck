"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSubsctiptionHistoryDTO = void 0;
const toSubsctiptionHistoryDTO = (history) => ({
    userId: history.userId,
    role: history.role,
    amount: history.amount,
    paymentId: history.paymentId,
    subscriptionId: history.subscriptionId,
    status: history.status,
    startDate: history.startDate,
    endDate: history.endDate
});
exports.toSubsctiptionHistoryDTO = toSubsctiptionHistoryDTO;
