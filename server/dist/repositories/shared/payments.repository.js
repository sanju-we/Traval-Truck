"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const Payment_1 = require("../../models/Payment");
const baseRepository_1 = require("../../repositories/baseRepository");
class PaymentRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Payment_1.Payment);
    }
}
exports.PaymentRepository = PaymentRepository;
