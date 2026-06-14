export interface CouponDTO{
  id:string,
  couponCode:string,
  discountType:"percentage" | "flat",
  discountValue:number,
  minPurchase:number,
  expiryDate:Date,
  isActive:boolean,
  description?:string,
}