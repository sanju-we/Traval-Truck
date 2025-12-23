import { orderDTO } from "../../../../core/DTO/agency/response/agency.order.DTO.js";

export interface IAgencyOrderService{
  getAllOrder(userId:string):Promise<orderDTO[]>;
  setStartDate(orderId:string,date:string) :Promise<orderDTO>;
  getOrder(orderId:string):Promise<orderDTO>;
  startTrip(orderId:string):Promise<orderDTO>;
  completeActivity(orderId:string,day:number,activityIndex:number):Promise<orderDTO>;
  completeDay(orderId:string,day:number):Promise<orderDTO>;
}