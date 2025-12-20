import z from "zod";
export class CouponValidator {
    async addCouponValidator(data) {
        const CouponSchema = z
            .object({
            couponCode: z
                .string()
                .trim()
                .min(4, "Coupon code must be at least 4 characters long")
                .max(20, "Coupon code cannot exceed 20 characters")
                .regex(/^[A-Z0-9-]+$/, "Coupon code must contain only Capital Letters, Positive Numbers, and '-' characters Only"),
            discountType: z.enum(["percentage", "flat"]),
            discountValue: z
                .number()
                .positive("Discount value must be greater than 0"),
            minPurchase: z
                .number()
                .min(0, "Minimum purchase must be at least 0")
                .optional(),
            expiryDate: z
                .string()
                .refine((val) => {
                const date = new Date(val);
                return !isNaN(date.getTime()) && date > new Date();
            }, "Expiry date must be a valid future date"),
        })
            .refine((data) => data.discountType === "percentage"
            ? data.discountValue <= 100
            : true, {
            message: "Percentage discount cannot exceed 100%",
            path: ["discountValue"],
        });
        CouponSchema.parse(data);
    }
    async IdValidator(id) {
        const objectIdSchema = z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Data Id");
        objectIdSchema.parse(id);
    }
}
