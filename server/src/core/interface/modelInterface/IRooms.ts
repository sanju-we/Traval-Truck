import { Document, ObjectId } from 'mongoose';

export interface IRooms extends Document {
  _id: ObjectId;
  RoomNumber: number;
  Description: string;
  PricePerNight: number;
  Capacity: number;
  Facilities: string[];
  Images: string[];
  reviews: {
    Comment: string;
    CreatedAt: Date;
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
  CreatedAt: Date;
  HotelId: string;
  isBlocked:boolean
}