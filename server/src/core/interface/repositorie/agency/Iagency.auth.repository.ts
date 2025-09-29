import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';
import { vendorData } from 'types';
import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

export interface IAgencyRespository {
  findByEmail(email: string): Promise<IAgency | null>;
  fingById(id: string): Promise<IAgency | null>;
  createAgency(data: vendorData & { isApproved: boolean; role: string }): Promise<IAgency>;
  updateAgencyPasswordById(id: string, hashedPassword: string): Promise<void>;
  findAllRequest(): Promise<vendorRequestDTO[]>;
  findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void>;
  findAll(): Promise<vendorRequestDTO[]>;
}
