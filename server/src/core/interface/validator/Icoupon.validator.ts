import { CouponDTO } from "@core/DTO/admin/coupon/admin.coupon.response";

export interface ICouponValidator {
  addCouponValidator(data:CouponDTO):Promise<void>;
}