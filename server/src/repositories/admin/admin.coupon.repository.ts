import { IAdminCouponRepository } from "../../core/interface/repositorie/admin/Iadmin.coupon.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { Coupon } from "../../models/Coupons.js";
import { ICoupons } from "../../core/interface/modelInterface/Icoupon";
import { CouponDTO, toCouponDTO } from "../../core/DTO/admin/coupon/admin.coupon.response.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

export class AdminCouponRepository extends BaseRepository<ICoupons> implements IAdminCouponRepository {
  constructor() {
    super(Coupon)
  }

  async findAllCouponWithPagination(page: number, lim?: number): Promise<{ data: CouponDTO[]; total: number; page: number; totalPages: number; }> {
    const limit = lim || 6;
    const skip = (page - 1) * limit;

    const [coupons,total] = await Promise.all([
      Coupon.find().skip(skip).limit(limit),
      Coupon.countDocuments()
    ]);
    if (!coupons.length) throw new DataNotFoundError()
    return {
      data: coupons.map(toCouponDTO),
      total,
      page,
      totalPages:Math.ceil(total/limit)
    }
  }
}