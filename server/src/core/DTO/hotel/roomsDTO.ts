import { IRooms } from "../../../core/interface/modelInterface/IRooms.js";


export interface reviews{
  Comment:string;
  CreatedAt:Date;
  Name:string;
  Rating:number;
  UserId:string;
}

export interface RoomsDTO{
  id:string;
  RoomNumber:number;
  Description:string;
  PricePerNight:number;
  Capacity:number;
  Facilities:string[];
  images:string[];
  reviews:{ Comment: string; CreatedAt: Date; Name: string; Rating: string; UserId: string; }[];
  Available?:number;
  Status:string;
  CreatedAt:Date;
  HotelId:string;
  isBlocked:boolean;
}

export const toRoomsDTO = (Room:IRooms) : RoomsDTO => ({
  id:Room._id.toString(),
  RoomNumber:Room.RoomNumber,
  Description:Room.Description,
  PricePerNight:Room.PricePerNight,
  Capacity:Room.Capacity,
  Facilities:Room.Facilities,
  images:Room.Images,
  reviews:Room.reviews,
  Available:Room.AvailableCount,
  Status:Room.Status,
  CreatedAt:Room.CreatedAt,
  HotelId:Room.HotelId,
  isBlocked:Room.isBlocked
})