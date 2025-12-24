import { TripDTO } from "../../../../core/DTO/user/Response/user.trip.DTO.js";

export interface IAdminOrderService {
  getAllOrders():Promise<TripDTO[]>;
}