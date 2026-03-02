export interface Hotel {
  id: string;
  companyName: string;
  address: string;
  Description: string;
  location: string;
  rating?: number;
  logo?: string;
  PricePerNight: number;
  images?: string[];
}

export interface RoomData {
  id: string;
  RoomNumber: number;
  roomType: string;
  Description: string;
  PricePerNight: number;
  Capacity: number;
  Facilities: string[];
  images: string[];
  Status: string;
  HotelId: {
    companyName: string;
    email: string;
    phone: string;
    ownerName: string;
    documents?: { loeo?: string };
  };
}

export interface HotelOrder {
  id: string;
  orderId: string;
  amount: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  product: {
    RoomNumber: number;
    PricePerNight: number;
    Capacity: number;
    Images?: string[];
  };
}

export interface HotelOrderDetails {
  id: string;
  orderId: string;
  amount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Ongoing';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
  product: {
    _id: string;
    RoomNumber: number;
    Capacity: number;
    Description: string;
    Facilities: string[];
    PricePerNight: number;
    Images: string[];
    Status: string;
  };
}

export interface Room {
  id: string;
  RoomNumber: number;
  Capacity: number;
  Description: string;
  PricePerNight: number;
  Status: string;
  images?: string[];
}

export interface IRoom {
  id: string;
  RoomNumber: number;
  roomType: string;
  Description: string;
  PricePerNight: number;
  Capacity: number;
  Facilities: string[];
  images: string[];
  reviews: {
    Comment: string;
    CreatedAt: string;
    Name: string;
    Rating: string;
    UserId: string;
  }[];
  rating: {
    Average: number;
    Count: number;
  };
  AvailableCount: number;
  Status: string;
  CreatedAt: string;
  HotelId: string;
  isBlocked: boolean;
}