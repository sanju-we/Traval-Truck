import { orderDTO } from "../../../../core/DTO/agency/response/agency.order.DTO";
import { TripDTO } from "../../../../core/DTO/user/Response/user.trip.DTO";
import { IOrders } from "../../../../core/interface/modelInterface/IOrders";
import { IBaserepository } from "../IBaseRepositories";

export interface IOrdersRepository extends IBaserepository<IOrders>{
  findAllByProduct(userId:string):Promise<TripDTO[]>;
  findOrderWithProduct(orderId:string):Promise<IOrders | null>
  findOrderWithUser(orderId:string):Promise<IOrders | null>
  findAllOrdersAdmin():Promise<TripDTO[] | null>
}