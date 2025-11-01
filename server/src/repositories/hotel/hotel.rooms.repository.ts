import Rooms from "../../models/Rooms.js";
import { IRooms } from "../../core/interface/modelInterface/IRooms.js";
import { IHotelRoomsRepository } from "../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";

export class HotelRoomsRepository extends BaseRepository<IRooms> implements IHotelRoomsRepository{
  constructor(){
    super(Rooms)
  }
}