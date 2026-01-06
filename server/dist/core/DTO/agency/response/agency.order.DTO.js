export const toOrderDTO = (order) => ({
    id: order._id.toString(),
    userId: order.userId.toString(),
    orderId: order.orderId,
    product: order.product && typeof order.product === 'object' ? JSON.parse(JSON.stringify(order.product)) : order.product,
    amount: order.amount,
    status: order.status,
    startDate: order.startDate,
    endDate: order.endDate,
    paymentId: order.paymentId && typeof order.paymentId === 'object' ? JSON.parse(JSON.stringify(order.paymentId)) : order.paymentId,
    createdAt: order.createdAt,
    ownedBy: order.ownedBy && typeof order.ownedBy === 'object' ? JSON.parse(JSON.stringify(order.ownedBy)) : order.ownedBy,
    reason: order.reason,
    plan: order.plan,
    productType: order.productType
});
