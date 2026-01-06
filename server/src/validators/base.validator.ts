import { IBaseValidator } from "../core/interface/validator/IBasic.validator.js";
import z from "zod";

export class BaseValidator implements IBaseValidator {
  async idValidator(id: string): Promise<void> {
    const schema = z.string()
    schema.parse(id)
  }

  async reviewValidator(data: { rating: number; comment: string; vendor:string; }): Promise<void> {
    const schema = z.object({
      rating: z.number().min(1, 'Atleast 1 start is required').max(5, 'Maximum 5 star is valid'),
      comment: z.string().trim().min(5, 'Comment atleast 5 letters is long'),
      vendor:z.string()
    })
    schema.parse(data)
  }

  async orderIdValidator(orderId: string): Promise<void> {
    const orderSchema = z.string().regex(
      /^ORD-\d{8}-\d{6}$/,
      "Invalid order ID format"
    )
    orderSchema.parse(orderId)
  }
}