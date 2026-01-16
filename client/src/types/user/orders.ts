
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
  product: any;
  amount: number;
  originalAmount?: number;
  discount?: number;
  couponId?: {
    code: string;
    discount: number;
    type: string;
  };
  ownedBy?: any;
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  plan?: PlanDay[];
  tripProgress?: {
    currentDay: number;
    completedDays: number[];
    startedAt?: string;
    completedAt?: string;
  };
  paymentId: any;
  createdAt: string;
  updatedAt?: string;
}
