import { orderDTO } from "../../../../core/DTO/agency/response/agency.order.DTO";

export interface IAgencyOrderService{
  getAllOrder(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
    status?: string,
    price?: string,
    sortBy?: string
  ): Promise<{ data: orderDTO[]; total: number; page: number; totalPages: number; }>;
  setStartDate(orderId:string,date:string) :Promise<orderDTO>;
  getOrder(orderId:string):Promise<orderDTO>;
  startTrip(orderId:string):Promise<orderDTO>;
  completeActivity(orderId:string,day:number,activityIndex:number):Promise<orderDTO>;
  completeDay(orderId:string,day:number):Promise<orderDTO>;
  completeTrip(orderId:string):Promise<orderDTO>
}