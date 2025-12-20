import { toPackageDTO } from "../../../../core/DTO/agency/request/packageDTO.js";
// export const toTrip = (order)
export const toTripDTO = (order) => ({
    id: order._id.toString(),
    orderId: order.orderId,
    product: toPackageDTO(order.product),
    amount: order.amount,
    status: order.status,
});
