import { BaseRepository } from "../../repositories/baseRepository.js";
import { Order } from "../../models/Orders.js";
import { logger } from "../../utils/logger.js";
import { toTripDTO } from "../../core/DTO/user/Response/user.trip.DTO.js";
export class OrderRepository extends BaseRepository {
    constructor() {
        super(Order);
    }
    async findAllByProduct(userId) {
        const data = await Order.find({ userId: userId }).populate('product');
        logger.info(`sanju ${data}`);
        return data.map(toTripDTO);
    }
    async findOrderWithProduct(orderId) {
        const data = await Order.findById(orderId).populate('product');
        return data;
    }
}
