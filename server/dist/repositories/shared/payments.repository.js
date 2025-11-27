import { Payment } from "../../models/Payment.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
export class PaymentRepository extends BaseRepository {
    constructor() {
        super(Payment);
    }
}
