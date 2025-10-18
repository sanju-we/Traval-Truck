import { User } from '../../../../models/SUser.js';
import { Agency } from '../../../../models/Agency.js';
import { Hotel } from '../../../../models/Hotel.js';
import { Restaurant } from '../../../../models/Restaurant.js';
import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { userProfileDTO } from 'types';

export interface IAdminVendorRepository {
  findAllRequests(): Promise<vendorRequestDTO[]>;
  findAllUsers(
    page: number,
    limit: number,
  ): Promise<{
    data: (vendorRequestDTO | userProfileDTO)[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
