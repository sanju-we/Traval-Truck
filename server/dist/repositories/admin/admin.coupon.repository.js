import { BaseRepository } from "../../repositories/baseRepository";
import { Coupon } from "../../models/Coupons";
import { toCouponDTO } from "../../core/DTO/admin/coupon/admin.coupon.response";
import { DataNotFoundError } from "../../utils/resAndErrors";
export class AdminCouponRepository extends BaseRepository {
    constructor() {
        super(Coupon);
    }
    async findAllCouponWithPagination(page, lim) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const [coupons, total] = await Promise.all([
            Coupon.find().skip(skip).limit(limit),
            Coupon.countDocuments()
        ]);
        if (!coupons.length)
            throw new DataNotFoundError();
        return {
            data: coupons.map(toCouponDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
