import { ProductData } from './profile';

export interface PlanDay {
  date: string;
  day: number;
  title: string;
  activities: string[];
  completedActivities?: number[];
  isCompleted?: boolean;
}

export interface OrderDetails {
  id: string;
  orderId: string;
  userId: string | {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  productType?: 'Package' | 'Rooms' | 'Foods';
  product: {
    type: string;
    data: ProductData;
    ownedBy?: string;
  };
  amount: number;
  originalAmount?: number;
  discount?: number;
  couponId?: {
    code: string;
    discount: number;
    type: string;
  };
  ownedBy?: {
    _id: string;
    name?: string;
    companyName?: string;
    logo?: string;
    email?: string;
    [key: string]: unknown;
  };
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  people?: number;
  guestName?: string;
  guestAge?: number;
  plan?: PlanDay[];
  tripProgress?: {
    currentDay: number;
    completedDays: number[];
    startedAt?: string;
    completedAt?: string;
  };
  paymentId: {
    _id: string;
    transactionId?: string;
    paymentMethod?: string;
    paymentStatus?: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}
