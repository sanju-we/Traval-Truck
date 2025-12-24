import { RoomsDTO } from "../../../core/DTO/hotel/roomsDTO.js";

export interface IRoomValidator{
  roomValidator(data:Partial<RoomsDTO>):Promise<void>;
}