"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTripDTO = exports.mapTripProduct = void 0;
const packageDTO_1 = require("../../../../core/DTO/agency/request/packageDTO");
const roomsDTO_1 = require("../../../../core/DTO/hotel/roomsDTO");
const mapTripProduct = (order) => {
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
    startDate: order.startDate,
    endDate: order.endDate,
    productType: order.productType
});
exports.toTripDTO = toTripDTO;
