export default interface User {
  id: string;
  _id?: string;
  name?: string;
  userName?: string;
  profilePicture?: string;
  ownerName?: string;
  companyName?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  isRestricted?: boolean;
  phone?: number;
  email: string;
  role: string;
  createdAt: string;
  logo: string;
}

export interface UserProfile {
  id: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  isBlocked: boolean;
  role: string;
  googleId: string;
  newPassword?:string;
  oldPassword?:string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: number;
  gender?: string;
  interest?: string[];
}

export interface ProductData {
  availableFoods?: string[];
  description?: string;
  itinerary?: { day: number; title: string; activities: string[] }[];
  price?: number;
  title?: string;
  name?: string;
  images?: string[];
  duration?: string;
  // Room specific
  RoomNumber?: number;
  roomType?: string;
  Description?: string;
  PricePerNight?: number;
  Capacity?: number;
  Facilities?: string[];
  Status?: string;
  id?: string;
  _id?: string;
  ownedBy?: string;
}

export interface Trip {
  id: string;
  orderId: string;
  product: {
    type: 'Package' | 'Rooms' | 'Foods';
    data: ProductData;
  };
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  agencyId?: string;
  amount: number;
  people?: number;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
  productType: string;
}