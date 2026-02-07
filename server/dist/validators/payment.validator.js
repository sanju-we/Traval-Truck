"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidator = void 0;
const zod_1 = __importDefault(require("zod"));
class PaymentValidator {
    async addMoneyValidator(paymentIntentId, amount) {
        const schema = zod_1.default.object({
            paymentIntentId: zod_1.default.string(),
            amount: zod_1.default.number('Amount must be a number').gte(50, 'Amount must be 50 or greate than 50')
        });
        schema.parse({ paymentIntentId, amount });
    }
}
exports.PaymentValidator = PaymentValidator;
