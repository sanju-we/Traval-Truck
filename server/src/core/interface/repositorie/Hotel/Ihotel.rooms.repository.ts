import { IRooms } from "../../../../core/interface/modelInterface/IRooms";
import { IBaserepository } from "../IBaseRepositories";
import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO";

export interface IHotelRoomsRepository extends IBaserepository<IRooms>{
  findAllPackageWithPartners(page:number,lim?:number,search?:string):Promise<{ data: RoomsDTO[], total: number, page: number, totalPages: number }>;
  findPackageWithPartner(id:string):Promise<RoomsDTO>;
}