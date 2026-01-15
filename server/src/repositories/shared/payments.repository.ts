import { IPaymentRepository } from "../../core/interface/repositorie/shared/Ishared.payment.repository";
import { IPayment } from "../../core/interface/modelInterface/IPayment";
import { Payment } from "../../models/Payment";
import { BaseRepository } from "../../repositories/baseRepository";

export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository{
  constructor(){
    super(Payment)
  }
}