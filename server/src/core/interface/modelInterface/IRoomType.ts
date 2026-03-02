import { Document, Types } from "mongoose";

export interface IRooms {
  HotelId: Types.ObjectId;
  RoomNumber: number;
  roomType: string;
  Description?: string;
  PricePerNight: number;
  Capacity: number;
  Facilities?: string[];
  Images?: string[];
  isBlocked: boolean;
  createdAt: Date;
  AvailableCount?: number;
  Status?: string;
  reviews?: { Comment: string; CreatedAt: Date; Name: string; Rating: string; UserId: string; }[];
}

export interface IRoomsDocument extends IRooms, Document {
  _id: Types.ObjectId;
}

export type IRoomType = IRooms & { _id: Types.ObjectId };