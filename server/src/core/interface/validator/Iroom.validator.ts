import { RoomsDTO } from "../../../core/DTO/hotel/roomsDTO";

export interface IRoomValidator{
  roomValidator(data:Partial<RoomsDTO>):Promise<void>;
}