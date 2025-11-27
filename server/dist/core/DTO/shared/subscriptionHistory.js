export const toSubsctiptionHistoryDTO = (history) => ({
    userId: history.userId,
    role: history.role,
    amount: history.amount,
    paymentId: history.paymentId,
    subscriptionId: history.subscriptionId,
    status: history.status,
    startDate: history.startDate,
    endDate: history.endDate
});
