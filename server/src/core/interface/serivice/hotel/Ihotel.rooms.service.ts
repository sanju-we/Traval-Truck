import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO.js";

export interface IHotelRoomsService {
  addRoom(data:RoomsDTO,file:Express.Multer.File[]):Promise<RoomsDTO>;
  getRoom(id:string):Promise<RoomsDTO>;
  getAllRooms(hotelID:string):Promise<RoomsDTO[]>;
}