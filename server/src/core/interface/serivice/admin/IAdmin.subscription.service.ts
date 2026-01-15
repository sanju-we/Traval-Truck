import { subscriptionDTO } from '../../../../core/DTO/subscription.dto';
import { subscriptionData } from 'types';

export interface IAdminSubscriptionService {
  addSub(data: subscriptionData): Promise<subscriptionDTO>;
  getAllSubscriptions(): Promise<subscriptionDTO[]>;
  editSubscription(data: subscriptionData, id: string): Promise<subscriptionDTO>;
  tonggleStatusService(id: string): Promise<subscriptionDTO>;
}
