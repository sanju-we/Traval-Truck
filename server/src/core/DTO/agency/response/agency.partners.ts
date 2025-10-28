import { IPartner } from '../../../../core/interface/modelInterface/IPartner.js';

export interface PartnerDTO {
  id: string;
  PartnerType: string;
  partnerName: string;
  status: string;
  contactPerson: string;
  phone: number;
  media: {
    Gallery: string[];
    Logo: string;
  };
  details: {
    AvgPriceRange: number;
    Category: string;
    Description: string;
    Facilities: string[];
  }[];
  email: string;
  location: string;
  partner:string[];
}

export const toPartnerDTO = (partner: IPartner): PartnerDTO => ({
  id: partner._id.toString(),
  partnerName: partner.PartnerName,
  PartnerType: partner.PartnerType,
  contactPerson: partner.ContactPerson,
  status: partner.Status,
  phone: partner.Phone,
  media: partner.Media,
  details: partner.Details,
  email: partner.Email,
  location: partner.Location,
  partner:partner.partner
});
