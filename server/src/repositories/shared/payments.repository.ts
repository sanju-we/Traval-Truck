import { IPaymentRepository } from "../../core/interface/repositorie/shared/Ishared.payment.repository";
import { IPayment } from "../../core/interface/modelInterface/IPayment.js";
import { Payment } from "../../models/Payment.js";
import { BaseRepository } from "../../repositories/baseRepository.js";

export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository{
  constructor(){
    super(Payment)
  }
}