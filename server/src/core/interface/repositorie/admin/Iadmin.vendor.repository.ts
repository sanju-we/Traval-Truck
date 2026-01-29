import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { userProfileDTO } from 'types';

export interface IAdminVendorRepository {
  findAllRequests(search?:string): Promise<vendorRequestDTO[]>;
  findAllUsers(
    page: number,
    limit: number,
    status:string,
    role:string,
    search:string
  ): Promise<{
    data: (vendorRequestDTO | userProfileDTO)[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
