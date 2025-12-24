import { toPackageDTO } from "../../../../core/DTO/agency/request/packageDTO.js";
import { toRoomsDTO } from "../../../../core/DTO/hotel/roomsDTO.js";
export const mapTripProduct = (order) => {
    switch (order.productType) {
        case "Package":
            return {
                type: "Package",
                data: toPackageDTO(order.product)
            };
        case "Rooms":
            return {
                type: "Rooms",
                data: toRoomsDTO(order.product)
            };
        default:
            throw new Error("Unsupported product type");
    }
};
// export const toTrip = (order)
export const toTripDTO = (order) => ({
    id: order._id.toString(),
    orderId: order.orderId,
    product: mapTripProduct(order),
    amount: order.amount,
    status: order.status,
    plan: order.plan,
    startDate: order.startDate,
    endDate: order.endDate
});
