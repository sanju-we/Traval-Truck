"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Orders_1 = require("../../models/Orders");
const user_trip_DTO_1 = require("../../core/DTO/user/Response/user.trip.DTO");
class OrderRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Orders_1.Order);
    }
    async findAllByProduct(userId) {
        const data = await Orders_1.Order.find({ userId: userId }).populate('product');
        console.log(data);
        return data.map(order => (0, user_trip_DTO_1.toTripDTO)(order));
    }
    async findOrderWithProduct(orderId) {
        const data = await Orders_1.Order.findById(orderId).populate('product').populate('ownedBy');
        return data;
    }
    async findOrderWithUser(orderId) {
        const data = await Orders_1.Order.findById(orderId).populate('userId').populate('ownedBy');
        return data;
    }
    async findAllOrdersAdmin() {
        const orders = await Orders_1.Order.find().populate('userId').populate('ownedBy').populate('product');
        return orders.map(order => (0, user_trip_DTO_1.toTripDTO)(order));
    }
}
exports.OrderRepository = OrderRepository;
