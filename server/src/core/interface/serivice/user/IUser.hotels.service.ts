import { PaginationResponse } from "../../../../core/DTO/pagination.DTO";
import { RoomsDTO } from "../../../../core/DTO/hotel/roomsDTO";

export interface IUserHotelsService {
  getAllHotels(page: number, limit: number, search?: string, minRating?: number, sortBy?: string): Promise<PaginationResponse<unknown>>;
  getRoom(id: string): Promise<RoomsDTO>;
  getRoomsByHotel(hotelId: string, searchParams?: { startDate?: string; endDate?: string; people?: number }): Promise<RoomsDTO[]>;
  getHotelDetails(hotelId: string): Promise<unknown>;
  initializeSession(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string, people: number, guestName?: string, guestAge?: number): Promise<{ url: string, sessionId: string }>
  walletPurchase(roomId: string, role: string, userId: string, amount: number, couponId: string, startDate: string, people: number, guestName?: string, guestAge?: number): Promise<{ success: boolean; message: string }>
}