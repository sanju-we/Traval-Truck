import { Agency } from '../../models/Agency.js';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { IAgency } from '../../core/interface/modelInterface/IAgency.js';
import { vendorData } from 'types/index.js';
import {
  vendorRequestDTO,
  toVendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

export class agencyRepository implements IAgencyRespository {
  async findByEmail(email: string): Promise<IAgency | null> {
    return await Agency.findOne({ email });
  }

  async fingById(id: string): Promise<IAgency | null> {
    return await Agency.findById(id);
  }

  async createAgency(data: vendorData & { isApproved: boolean; role: string }): Promise<IAgency> {
    return await Agency.create(data);
  }

  async updateAgencyPasswordById(id: string, hashedPassword: string): Promise<void> {
    await Agency.findByIdAndUpdate(id, { password: hashedPassword });
    return;
  }

  async findAllRequest(): Promise<vendorRequestDTO[]> {
    const allReq = await Agency.find({ isApproved: false });
    return allReq.map(toVendorRequestDTO);
  }

  async findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void> {
    await Agency.findByIdAndUpdate(id, { [field]: action });
  }

  async findAll(): Promise<vendorRequestDTO[]> {
    const users = await Agency.find({ isApproved: true });
    return users.map(toVendorRequestDTO);
  }
}
