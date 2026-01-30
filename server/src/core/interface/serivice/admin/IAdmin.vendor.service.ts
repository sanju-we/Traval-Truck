export interface IAdminVendorService {
  updateStatus(id: string, action: string, role: string, reason: string | null): Promise<void>;
  updateBlock(id: string, role: string): Promise<void>;
  getAllAgency(page: number, limit: number, search: string, status: string): Promise<any>;
  getAllHotels(page: number, limit: number, search: string, status: string): Promise<any>;
  getAllRestaurants(page: number, limit: number, search: string, status: string): Promise<any>;
}
