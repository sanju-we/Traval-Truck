import { orderDTO } from "../../../../core/DTO/agency/response/agency.order.DTO";
import { TripDTO } from "../../../../core/DTO/user/Response/user.trip.DTO";

export interface IUserTripService {
  history(userId: string, page?: number, limit?: number): Promise<TripDTO[]>;
  getOrder(orderId: string): Promise<orderDTO>;
  orderCancellation(orderId: string, reason: string): Promise<orderDTO>;
}