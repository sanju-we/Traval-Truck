"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCouponRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Coupons_1 = require("../../models/Coupons");
const admin_coupon_response_1 = require("../../core/DTO/admin/coupon/admin.coupon.response");
const resAndErrors_1 = require("../../utils/resAndErrors");
class AdminCouponRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Coupons_1.Coupon);
    }
    async findAllCouponWithPagination(page, lim) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const [coupons, total] = await Promise.all([
            Coupons_1.Coupon.find().skip(skip).limit(limit),
            Coupons_1.Coupon.countDocuments()
        ]);
        if (!coupons.length)
            throw new resAndErrors_1.DataNotFoundError();
        return {
            data: coupons.map(admin_coupon_response_1.toCouponDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
exports.AdminCouponRepository = AdminCouponRepository;
