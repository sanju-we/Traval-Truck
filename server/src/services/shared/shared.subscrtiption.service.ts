import { ISharedSubscriptionService } from "../../core/interface/serivice/shared/Ishared.subscription.service.js";
import { ISubscriptionRepository } from "../../core/interface/repositorie/ISubscription.respository.js";
import { inject, injectable } from "inversify";
import { subscriptionDTO, toSubdcriptionDTO } from "../../core/DTO/subscription.dto.js";
import { Data_Creation_Error, DataNotFoundError, PAYMENT_VERIFICATOIN_FAILED } from "../../utils/resAndErrors.js";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils.js";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js";
import { subscriptionHistoryDTO, toSubsctiptionHistoryDTO } from "../../core/DTO/shared/subscriptionHistory.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class SharedSubscriptionService implements ISharedSubscriptionService {
  constructor(
    @inject('ISubscriptionRepository') private readonly _subscriptionRepo: ISubscriptionRepository,
    @inject('IPaymentUtils') private readonly _paymentUtils: IPaymentUtils,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository
  ) { }

  async getAllSubscription(): Promise<subscriptionDTO[]> {
    const subscriptions = await this._subscriptionRepo.findAllUser({ IsActive: true }, {})
    if (subscriptions) return subscriptions.map(toSubdcriptionDTO)
    throw new DataNotFoundError()
  }

  async getCurrentPlan(id: string): Promise<subscriptionDTO> {
    const current = await this._subscriptionHistoryRepo.findOne({ userId: id, status: 'active' });
    if (!current) throw new DataNotFoundError()
    const currentPlan = await this._subscriptionRepo.findById(current.subscriptionId)
    if (currentPlan) {
      currentPlan.Duration.endingDate = current.endDate;
      return toSubdcriptionDTO(currentPlan)
    }
    throw new DataNotFoundError()
  }

  async getSubscription(id: string): Promise<subscriptionDTO> {
    const subscription = await this._subscriptionRepo.findById(id)
    if (subscription) return toSubdcriptionDTO(subscription)
    throw new DataNotFoundError()
  }

  async purchaseSubscription(paymentIntentId: string, amount: number, id: string, userId: string, role: string): Promise<subscriptionHistoryDTO> {
    // validation
    const valid = await this._paymentUtils.verifyPaymentIntent(paymentIntentId, amount)
    if (!valid.valid) throw new PAYMENT_VERIFICATOIN_FAILED()
    logger.info(id)
    const Plan = await this._subscriptionRepo.findById(id);
    if (!Plan) throw new DataNotFoundError();
    const day = Plan.Valid * (24 * 60 * 60 * 1000)
    const endDate = new Date(Date.now() + day)
    const saved = await this._subscriptionHistoryRepo.create({ userId: userId, role: role, paymentId: paymentIntentId, subscriptionId: id, startDate: new Date(Date.now()), endDate: endDate })
    if (saved) return toSubsctiptionHistoryDTO(saved)
    throw new Data_Creation_Error()
  }
}