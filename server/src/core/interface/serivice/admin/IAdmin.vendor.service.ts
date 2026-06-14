import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto';

export interface IAdminVendorService {
  updateStatus(id: string, action: string, role: string, reason: string | null): Promise<void>;
  updateBlock(id: string, role: string): Promise<void>;
  getAllAgency(page: number, limit: number, search: string, status: string): Promise<{ data: vendorRequestDTO[]; total: number; totalPages: number }>;
  getAllHotels(page: number, limit: number, search: string, status: string): Promise<{ data: vendorRequestDTO[]; total: number; totalPages: number }>;
  getAllRestaurants(page: number, limit: number, search: string, status: string): Promise<{ data: vendorRequestDTO[]; total: number; totalPages: number }>;
}
