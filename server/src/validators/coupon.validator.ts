import { CouponDTO } from "@core/DTO/admin/coupon/admin.coupon.response.js";
import { ICouponValidator } from "../core/interface/validator/Icoupon.validator.js";
import z from "zod";

export class CouponValidator implements ICouponValidator {
  async addCouponValidator(data: CouponDTO): Promise<void> {
    const CouponSchema = z
      .object({
        couponCode: z
          .string()
          .trim()
          .min(4, "Coupon code must be at least 4 characters long")
          .max(20, "Coupon code cannot exceed 20 characters")
          .regex(/^[A-Z0-9\-]+$/, "Coupon code must contain only A-Z, 0-9, and '-' characters"),

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

        maxUsage: z
          .number()
          .int("Max usage must be an integer")
          .positive("Max usage must be greater than 0"),

        isActive: z.boolean(),
      })
      .refine(
        (data) =>
          data.discountType === "percentage"
            ? data.discountValue <= 100
            : true,
        {
          message: "Percentage discount cannot exceed 100%",
          path: ["discountValue"],
        }
      );
  }
}