import { IDuration } from '../../core/interface/modelInterface/Isubscription';

export interface subscriptionDTO {
  id: string;
  name: string;
  category: string;
  duration: IDuration;
  valid: number;
  description: string;
  amount: number;
  features: string[];
  isActive: boolean;
}
