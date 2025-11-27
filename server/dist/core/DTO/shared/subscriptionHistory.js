export const toSubsctiptionHistoryDTO = (history) => ({
    userId: history.userId,
    role: history.role,
    paymentId: history.paymentId,
    subscriptionId: history.subscriptionId,
    status: history.status,
    startDate: history.startDate,
    endDate: history.endDate
});
