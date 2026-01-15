import { PaginationResponse } from "../../../../core/DTO/pagination.DTO.js";
import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO.js";

export interface IUserHotelsService {
  getAllHotels(page: number, limit: number,search?:number): Promise<PaginationResponse<RoomsDTO>>;
  getRoom(id:string) :Promise<RoomsDTO>
  initializeSession(roomId:string,role:string,userId:string,amount:number,couponId:string,startDate:string):Promise<{url:string,sessionId:string}>
}