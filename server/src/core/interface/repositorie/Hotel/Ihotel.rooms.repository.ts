import { IRooms } from "../../../../core/interface/modelInterface/IRooms";
import { IBaserepository } from "../IBaseRepositories";
import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO";
import { PaginationResponse } from "../../../../core/DTO/pagination.DTO";

export interface IHotelRoomsRepository extends IBaserepository<IRooms>{
  findAllPackageWithPartners(page:number,status:string,lim:number,search?:number,hotelID?:string):Promise<PaginationResponse<RoomsDTO>>;
  findPackageWithPartner(id:string):Promise<RoomsDTO>;
}