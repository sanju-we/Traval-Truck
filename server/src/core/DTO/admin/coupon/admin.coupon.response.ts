import { ICoupons } from "../../../interface/modelInterface/Icoupon.js";

export interface CouponDTO{
  id:string,
  couponCode:string,
  discountType:"percentage" | "flat",
  discountValue:number,
  minPurchase:number,
  expiryDate:Date,
  isActive:boolean,
}

export const toCouponDTO = (coupon:ICoupons) : CouponDTO =>({
  id:coupon._id.toString(),
  couponCode:coupon.couponCode,
  discountType:coupon.discountType,
  discountValue:coupon.discountValue,
  minPurchase:coupon.minPurchase,
  expiryDate:coupon.expiryDate,
  isActive:coupon.isActive
})