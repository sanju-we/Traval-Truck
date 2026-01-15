import { orderDTO } from "../../../../core/DTO/agency/response/agency.order.DTO";

export interface IHotelOrderService {
  getAllOrders(userId:string):Promise<orderDTO[]>;
  getOrder(orderId:string):Promise<orderDTO>;
  checkIn(orderId:string):Promise<{status:string}>;
  checkOut(orderId:string):Promise<{status:string}>;
}