export interface IAdminVendorService {
  updateStatus(id: string, action: string, role: string, reason : string|null): Promise<void>;
  updateBlock(id: string, role: string): Promise<void>;
}
