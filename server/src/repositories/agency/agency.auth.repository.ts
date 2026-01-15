import { Agency } from '../../models/Agency';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository';
import { IAgency } from '../../core/interface/modelInterface/IAgency';
import { BaseRepository } from '../../repositories/baseRepository';

export class agencyRepository extends BaseRepository<IAgency> implements IAgencyRespository {
  constructor() {
    super(Agency);
  }
  async updateAgencyPasswordById(id: string, hashedPassword: string): Promise<void> {
    await Agency.findByIdAndUpdate(id, { password: hashedPassword });
    return;
  }

  async findByIdAndUpdateAction(
    id: string,
    action: boolean,
    field: string,
    reason?: string,
  ): Promise<void> {
    if (reason != '') {
      await Agency.findByIdAndUpdate(id, { reason: reason });
    }
    await Agency.findByIdAndUpdate(id, { [field]: action });
  }
}
