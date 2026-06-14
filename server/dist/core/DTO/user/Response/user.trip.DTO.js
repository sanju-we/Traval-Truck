"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserOrderDetailsDTO = exports.toTripDTO = exports.mapTripProduct = void 0;
const packageDTO_1 = require("../../../../core/DTO/agency/request/packageDTO");
const roomsDTO_1 = require("../../../../core/DTO/hotel/roomsDTO");
const mapTripProduct = (order) => {
    if (!order.product) {
        if (order.productType === "Package") {
            return {
                type: "Package",
                data: {}
            };
        }
        else {
            return {
                type: "Rooms",
                data: {}
            };
        }
    }
    switch (order.productType) {
        case "Package":
            return {
                type: "Package",
                data: (0, packageDTO_1.toPackageDTO)(order.product)
            };
        case "Rooms":
            return {
                type: "Rooms",
                data: (0, roomsDTO_1.toRoomsDTO)(order.product)
            };
        default:
            throw new Error("Unsupported product type");
    }
};
exports.mapTripProduct = mapTripProduct;
// export const toTrip = (order)
const toTripDTO = (order) => ({
    id: order._id.toString(),
    orderId: order.orderId,
    product: (0, exports.mapTripProduct)(order),
    amount: order.amount,
    status: order.status,
    plan: order.plan,
    people: order.people,
    startDate: order.startDate,
    endDate: order.endDate,
    productType: order.productType,
    createdAt: order.createdAt
});
exports.toTripDTO = toTripDTO;
const toUserOrderDetailsDTO = (order) => {
    const payment = order.paymentId;
    const productData = order.product;
    return {
        id: order._id.toString(),
        orderId: order.orderId,
        userId: order.userId.toString(),
        productType: order.productType,
        product: productData ? (0, exports.mapTripProduct)(order) : null,
        amount: order.amount,
        startDate: order.startDate,
        endDate: order.endDate,
        status: order.status,
        plan: order.plan,
        tripProgress: order.tripProgress,
        paymentId: {
            _id: payment?._id?.toString() || payment?.toString() || "",
            transactionId: payment?.paymentIntentId || payment?.sessionId || "N/A",
            paymentMethod: payment?.type || "Stripe",
            paymentStatus: payment?.status || "paid"
        },
        createdAt: order.createdAt,
        ownedBy: order.ownedBy,
        people: order.people,
        reason: order.reason
    };
};
exports.toUserOrderDetailsDTO = toUserOrderDetailsDTO;
