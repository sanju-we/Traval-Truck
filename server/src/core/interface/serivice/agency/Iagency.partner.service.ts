import { PartnerDTO } from '../../../../core/DTO/agency/response/agency.partners.js';

export interface IAgencyPartnerService {
  getAllThePartner(agencyId:string): Promise<PartnerDTO[]>;
  addPartner(data:Partial<PartnerDTO>,logoFile:Express.Multer.File,galleryFiles:Express.Multer.File[],agencyId:string):Promise<PartnerDTO>
}
