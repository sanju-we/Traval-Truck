
export interface Package {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  images: string[];
}

export interface PackageData {
  _id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  discoveries: string[];
  availableFoods: string[];
  itinerary: {
    activities: string[];
    day: number;
    title: string;
  }[];
  reviews: {
    Comment: string;
    Date: string;
    Rating: number;
    UserName: string;
  }[];
  CreatedBy: string;
  images: string[];
  ownedBy: string;
}

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
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
  };
  productType: 'Package' | 'Rooms' | 'Foods';
  role: 'Agency' | 'Restaurant' | 'Hotel';
  product: any;
  amount: number;
  ownedBy: {
    _id: string;
    name?: string;
    agencyName?: string;
    restaurantName?: string;
    hotelName?: string;
  };
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
  paymentId: {
    _id: string;
    transactionId?: string;
    paymentMethod?: string;
    paymentStatus?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  activities: string[];
  day: number;
  title: string;
}

export interface Review {
  Comment: string;
  Date: string;
  Rating: number;
  UserName?: string;
}

export interface Packages {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  discoveries: string[];
  availableFoods: string[];
  itinerary: Itinerary[];
  reviews: Review[];
  CreatedBy: string;
  images: string[];
}

export interface ReviewType {
  _id: string;
  rating: number;
  comment: string;
  userName?: string;
  createdAt: string;
  isReplayed?: boolean;
  reply?: {
    comment: string;
    replayer: string;
  };
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  valid: number;
  features: string[];
  endDate?: string;
}