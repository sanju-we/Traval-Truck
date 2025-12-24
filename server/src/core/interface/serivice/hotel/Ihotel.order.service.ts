import { orderDTO } from "../../../../core/DTO/agency/response/agency.order.DTO.js";

export interface IHotelOrderService {
  getAllOrders(userId:string):Promise<orderDTO[]>;
}