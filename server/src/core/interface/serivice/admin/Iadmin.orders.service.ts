import { TripDTO } from "../../../../core/DTO/user/Response/user.trip.DTO";

export interface IAdminOrderService {
  getAllOrders():Promise<TripDTO[]>;
}