import { Payment } from "../../models/Payment";
import { BaseRepository } from "../../repositories/baseRepository";
export class PaymentRepository extends BaseRepository {
    constructor() {
        super(Payment);
    }
}
