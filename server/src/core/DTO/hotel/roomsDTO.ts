import { IRoomType } from "../../interface/modelInterface/IRoomType";


export interface reviews {
  Comment: string;
  CreatedAt: Date;
  Name: string;
  Rating: number;
  UserId: string;
}

export interface RoomsDTO {
  id: string;
  RoomNumber: number;
  roomType: string;
  Description: string;
  PricePerNight: number;
  Capacity: number;
  Facilities: string[];
  images: string[];
  reviews: { Comment: string; CreatedAt: Date; Name: string; Rating: string; UserId: string; }[];
  AvailableCount?: number;
  Status: string;
  CreatedAt: Date;
  HotelId: string;
  isBlocked: boolean;
}

export const toRoomsDTO = (Room: IRoomType): RoomsDTO => ({
  id: Room._id.toString(),
  RoomNumber: Room.RoomNumber,
  roomType: Room.roomType,
  Description: Room.Description || "",
  PricePerNight: Room.PricePerNight,
  Capacity: Room.Capacity,
  Facilities: Room.Facilities || [],
  images: Room.Images || [],
  reviews: Room.reviews || [],
  AvailableCount: Room.AvailableCount || 1,
  Status: Room.Status || "Available",
  CreatedAt: Room.createdAt,
  HotelId: Room.HotelId.toString(),
  isBlocked: Room.isBlocked
})