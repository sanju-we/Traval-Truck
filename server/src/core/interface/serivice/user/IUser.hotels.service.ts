import { PaginationResponse } from "../../../../core/DTO/pagination.DTO";
import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO";

export interface IUserHotelsService {
  getAllHotels(page: number, limit: number, search?: string): Promise<PaginationResponse<unknown>>;
  getRoom(id: string): Promise<RoomsDTO>;
  getRoomsByHotel(hotelId: string, searchParams?: { startDate?: string; endDate?: string; people?: number }): Promise<RoomsDTO[]>;
  getHotelDetails(hotelId: string): Promise<unknown>;
  initializeSession(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string, people: number): Promise<{ url: string, sessionId: string }>
  walletPurchase(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string, people: number): Promise<{ success: boolean; message: string }>
}