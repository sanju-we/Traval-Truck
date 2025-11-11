import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO.js";

export interface IHotelRoomsService {
  addRoom(data:RoomsDTO,file:Express.Multer.File[]):Promise<RoomsDTO>;
  getRoom(id:string):Promise<RoomsDTO>;
  getAllRooms(hotelID:string):Promise<RoomsDTO[]>;
  updateStatus(data:{id:string,status:string}):Promise<RoomsDTO>;
  updateBlock(data:{id:string,status:boolean}):Promise<RoomsDTO>;
  getEditRoom(id:string):Promise<RoomsDTO>;
  updateRoom(data:Partial<RoomsDTO>,id:string,files:Express.Multer.File[]) : Promise<RoomsDTO>;
  deleteSingleImage(id:string,index:number):Promise<RoomsDTO>;
}