import { TripDTO } from "../../../../core/DTO/user/Response/user.trip.DTO.js";
import { IOrders } from "../../../../core/interface/modelInterface/IOrders.js";
import { IBaserepository } from "../IBaseRepositories.js";

export interface IOrdersRepository extends IBaserepository<IOrders>{
  findAllByProduct(userId:string):Promise<TripDTO[]>;
}