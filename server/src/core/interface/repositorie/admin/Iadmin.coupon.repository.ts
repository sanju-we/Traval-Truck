import { IBaserepository } from "../IBaseRepositories";
import { ICoupons } from "../../../../core/interface/modelInterface/Icoupon.js";
import { CouponDTO } from "../../../../core/DTO/admin/coupon/admin.coupon.response.js";

export interface IAdminCouponRepository extends IBaserepository<ICoupons>{
  findAllCouponWithPagination(page:number,lim?:number):Promise<{ data: CouponDTO[], total: number, page: number, totalPages: number }>;
}