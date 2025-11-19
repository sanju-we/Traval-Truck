import z from "zod";
export class PaymentValidator {
    async addMoneyValidator(paymentIntentId, amount) {
        const schema = z.object({
            paymentIntentId: z.string(),
            amount: z.number('Amount must be a number').gte(50, 'Amount must be 50 or greate than 50')
        });
        schema.parse({ paymentIntentId, amount });
    }
}
