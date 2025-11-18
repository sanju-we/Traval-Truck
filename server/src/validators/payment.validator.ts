import z from "zod";
import { IPaymentValidator } from "../core/interface/validator/Ipayment.validator.js";

export class PaymentValidator implements IPaymentValidator{
  async addMoneyValidator(paymentIntentId: string, amount: number): Promise<void> {
      const schema = z.object({
        paymentIntentId:z.string(),
        amount:z.number('Amount must be a number').gte(50,'Amount must be 50 or greate than 50')
      })

      schema.parse({paymentIntentId,amount})
  }
}