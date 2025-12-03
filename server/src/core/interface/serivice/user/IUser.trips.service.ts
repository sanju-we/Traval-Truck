import { TripDTO } from "../../../../core/DTO/user/Response/user.trip.DTO.js";

export interface IUserTripService {
  history(userId:string):Promise<TripDTO[]>;
}