import { orderDTO } from "../../../../core/DTO/agency/response/agency.order.DTO.js";
import { TripDTO } from "../../../../core/DTO/user/Response/user.trip.DTO.js";

export interface IUserTripService {
  history(userId:string):Promise<TripDTO[]>;
  getOrder(orderId:string):Promise<orderDTO>;
}