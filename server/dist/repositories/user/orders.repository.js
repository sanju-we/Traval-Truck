"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Orders_1 = require("../../models/Orders");
const user_trip_DTO_1 = require("../../core/DTO/user/Response/user.trip.DTO");
const Package_1 = require("../../models/Package");
const SUser_1 = require("../../models/SUser");
class OrderRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Orders_1.Order);
    }
    async findAllByProduct(userId, page, limit) {
        let query = Orders_1.Order.find({ userId: userId })
            .populate('product')
            .populate('ownedBy')
            .sort({ createdAt: -1 });
        // Apply pagination if both page and limit are provided
        if (page !== undefined && limit !== undefined && limit > 0) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const data = await query;
        return data.map(order => (0, user_trip_DTO_1.toTripDTO)(order));
    }
    async findOrderWithProduct(orderId) {
        const data = await Orders_1.Order.findById(orderId)
            .populate('product')
            .populate('ownedBy')
            .populate('paymentId');
        return data;
    }
    async findOrderWithUser(orderId) {
        const data = await Orders_1.Order.findById(orderId)
            .populate('userId')
            .populate('ownedBy');
        return data;
    }
    async findAllOrdersAdmin() {
        const orders = await Orders_1.Order.find()
            .populate('userId')
            .populate('ownedBy')
            .populate('product');
        return orders.map(order => (0, user_trip_DTO_1.toTripDTO)(order));
    }
    async findAllOrdersWithPagination(agencyId, page = 1, limit = 5, search, status, price, sortBy) {
        const filter = { ownedBy: agencyId };
        if (status && status !== 'All') {
            filter.status = status;
        }
        if (price && price !== 'All') {
            if (price === 'under_10k') {
                filter.amount = { $lt: 10000 };
            }
            else if (price === '10k_50k') {
                filter.amount = { $gte: 10000, $lte: 50000 };
            }
            else if (price === 'over_50k') {
                filter.amount = { $gt: 50000 };
            }
        }
        if (search && search.trim() !== '') {
            const regex = new RegExp(search, 'i');
            const [matchingPackages, matchingUsers] = await Promise.all([
                Package_1.Package.find({
                    $or: [
                        { title: regex },
                        { description: regex }
                    ]
                }).select('_id').lean(),
                SUser_1.User.find({
                    $or: [
                        { name: regex },
                        { email: regex }
                    ]
                }).select('_id').lean()
            ]);
            const packageIds = matchingPackages.map(p => p._id);
            const userIds = matchingUsers.map(u => u._id);
            filter.$or = [
                { orderId: regex },
                { product: { $in: packageIds } },
                { userId: { $in: userIds } }
            ];
        }
        const sort = {};
        if (sortBy) {
            if (sortBy === 'date_asc')
                sort.createdAt = 1;
            else if (sortBy === 'date_desc')
                sort.createdAt = -1;
            else if (sortBy === 'price_asc')
                sort.amount = 1;
            else if (sortBy === 'price_desc')
                sort.amount = -1;
        }
        else {
            sort.createdAt = -1;
        }
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Orders_1.Order.find(filter)
                .populate('product')
                .populate('userId')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            Orders_1.Order.countDocuments(filter)
        ]);
        return {
            data: orders,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
exports.OrderRepository = OrderRepository;
