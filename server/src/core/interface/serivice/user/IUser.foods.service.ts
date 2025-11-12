import { foodDTO } from "../../../../core/DTO/restaurant/requestDTO.js";

export interface IUserFoodsService{
  getAllRooms(page:number,limit:number,search?:string):Promise<{ data: foodDTO[]; total: number; page: number; totalPages: number; }>;
}