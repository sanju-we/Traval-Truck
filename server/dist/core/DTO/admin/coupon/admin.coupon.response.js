export const toCouponDTO = (coupon) => ({
    id: coupon._id.toString(),
    couponCode: coupon.couponCode,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minPurchase: coupon.minPurchase,
    expiryDate: coupon.expiryDate,
    isActive: coupon.isActive
});
