import { BaseRepository } from "../../repositories/baseRepository";
import { Order } from "../../models/Orders";
import { toTripDTO } from "../../core/DTO/user/Response/user.trip.DTO";
export class OrderRepository extends BaseRepository {
    constructor() {
        super(Order);
    }
    async findAllByProduct(userId) {
        const data = await Order.find({ userId: userId }).populate('product');
        console.log(data);
        return data.map(order => toTripDTO(order));
    }
    async findOrderWithProduct(orderId) {
        const data = await Order.findById(orderId).populate('product').populate('ownedBy');
        return data;
    }
    async findOrderWithUser(orderId) {
        const data = await Order.findById(orderId).populate('userId').populate('ownedBy');
        return data;
    }
    async findAllOrdersAdmin() {
        const orders = await Order.find().populate('userId').populate('ownedBy').populate('product');
        return orders.map(order => toTripDTO(order));
    }
}
