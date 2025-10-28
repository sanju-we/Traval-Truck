import { IAgencyPartnerService } from '../../core/interface/serivice/agency/Iagency.partner.service.js';
import { IAgencyPartnerRepository } from '../../core/interface/repositorie/agency/Iagency.partner.repostitory.js';
import { inject, injectable } from 'inversify';
import { PartnerDTO, toPartnerDTO } from '../../core/DTO/agency/response/agency.partners.js';
import { UserNotFoundError } from '../../utils/resAndErrors.js';
import { singleUpload } from '../../utils/upload.cloudinary.js';
import { logger } from '../../utils/logger.js';

@injectable()
export class AgencyPartnerService implements IAgencyPartnerService {
  constructor(
    @inject('IAgencyPartnerRepository')
    private readonly _agencyPartnerRepo: IAgencyPartnerRepository,
  ) { }

  async getAllThePartner(agencyId:string): Promise<PartnerDTO[]> {
    const allPartners = await this._agencyPartnerRepo.findAllUser({partner:agencyId},{})
    if (allPartners) return allPartners.map(toPartnerDTO);
    throw new UserNotFoundError();
  }

  async addPartner(data: Partial<PartnerDTO>,logoFile:Express.Multer.File,galleryFiles:Express.Multer.File[],agencyId:string): Promise<PartnerDTO> {
    const logoUrl = await singleUpload(logoFile,'Travel-Travel-Document')
    const galleoryUrls:string[] = [];
    for( let file of galleryFiles){
      let url = await singleUpload(file,'Travel-Travel-Document')
      galleoryUrls.push(url)
    }
    logger.info({...data,Media:{...(data.media || {}),Logo:logoUrl,Gallery:galleoryUrls},partner:[...(data.partner||[]),agencyId]})
    const partner = await this._agencyPartnerRepo.create({...data,Media:{...(data.media || {}),Logo:logoUrl,Gallery:galleoryUrls},partner:[...(data.partner||[]),agencyId]})
    if (partner) return toPartnerDTO(partner)
    throw new UserNotFoundError()
  }
}
