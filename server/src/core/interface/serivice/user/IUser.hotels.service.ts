import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO.js";

export interface IUserHotelsService {
  getAllHotels(page: number, limit: number): Promise<{
    data: RoomsDTO[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  getRoom(id:string) :Promise<RoomsDTO>
}