import { CouponDTO } from "../../../../core/DTO/admin/coupon/admin.coupon.response.js";

export interface IAdminCouponService{
  getAllCoupon(page?:number):Promise<{ data: CouponDTO[]; total: number; page: number; totalPages: number; }>
  addCoupon(data:CouponDTO):Promise<CouponDTO>;
  updateCoupon(id:string,data:CouponDTO):Promise<CouponDTO>;
}