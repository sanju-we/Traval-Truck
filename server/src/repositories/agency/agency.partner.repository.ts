import { IAgencyPartnerRepository } from '../../core/interface/repositorie/agency/Iagency.partner.repostitory.js';
import { BaseRepository } from '../../repositories/baseRepository.js';
import { IPartner } from '../../core/interface/modelInterface/IPartner.js';
import { Partner } from '../../models/Partner.js';

export class AgencyPartnerRepository
  extends BaseRepository<IPartner>
  implements IAgencyPartnerRepository
{
  constructor() {
    super(Partner);
  }
}
