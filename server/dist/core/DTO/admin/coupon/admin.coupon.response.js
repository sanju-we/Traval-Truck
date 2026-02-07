"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCouponDTO = void 0;
const toCouponDTO = (coupon) => ({
    id: coupon._id.toString(),
    couponCode: coupon.couponCode,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minPurchase: coupon.minPurchase,
    expiryDate: coupon.expiryDate,
    isActive: coupon.isActive
});
exports.toCouponDTO = toCouponDTO;
