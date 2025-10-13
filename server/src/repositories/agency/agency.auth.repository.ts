import { Agency } from '../../models/Agency.js';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { IAgency } from '../../core/interface/modelInterface/IAgency.js';
import { BaseRepository,RepositoryError } from '../../repositories/baseRepository.js';
import { vendorData } from 'types/index.js';
import {
  vendorRequestDTO,
  toVendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

export class agencyRepository extends BaseRepository<IAgency> implements IAgencyRespository {
  constructor(){
    super(Agency)
  }
  async updateAgencyPasswordById(id: string, hashedPassword: string): Promise<void> {
    await Agency.findByIdAndUpdate(id, { password: hashedPassword });
    return;
  }

  async findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void> {
    await Agency.findByIdAndUpdate(id, { [field]: action });
  }
}
