"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponValidator = void 0;
const zod_1 = __importDefault(require("zod"));
class CouponValidator {
    async addCouponValidator(data) {
        const CouponSchema = zod_1.default
            .object({
            couponCode: zod_1.default
                .string()
                .trim()
                .min(4, "Coupon code must be at least 4 characters long")
                .max(20, "Coupon code cannot exceed 20 characters")
                .regex(/^[A-Z0-9-]+$/, "Coupon code must contain only Capital Letters, Positive Numbers, and '-' characters Only"),
            discountType: zod_1.default.enum(["percentage", "flat"]),
            discountValue: zod_1.default
                .number()
                .positive("Discount value must be greater than 0"),
            minPurchase: zod_1.default
                .number()
                .min(0, "Minimum purchase must be at least 0")
                .optional(),
            expiryDate: zod_1.default
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
        const objectIdSchema = zod_1.default
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid Data Id");
        objectIdSchema.parse(id);
    }
}
exports.CouponValidator = CouponValidator;
