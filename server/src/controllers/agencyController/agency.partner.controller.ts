import { Request, Response } from 'express';
import { IAgencyPartnerController } from '../../core/interface/controllerInterface/agency/Iagency.partner.controller.js';
import { IAgencyPartnerService } from '../../core/interface/serivice/agency/Iagency.partner.service.js';
import { IAgencyAuthService } from '../../core/interface/serivice/agency/Iagency.auth.service.js';
import { inject, injectable } from 'inversify';
import { BADREQUEST, DataUpdatingError, sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import z from 'zod';
import { logger } from '../../utils/logger.js';

@injectable()
export class AgencyPartnerController implements IAgencyPartnerController {
  constructor(
    @inject('IAgencyPartnerService') private readonly _agencyPartnerService: IAgencyPartnerService,
    @inject('IAgencyAuthService') private readonly _agencyAuthService: IAgencyAuthService,
  ) { }
  
  async getAllPartners(req: Request, res: Response): Promise<void> {
    const agencyId = req.user.id;
    const allUsers = await this._agencyPartnerService.getAllThePartner(agencyId);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allUsers);
  }

  async addPartner(req: Request, res: Response): Promise<void> {
    logger.info('req.body', req.body);
    req.body.Coordinates = JSON.parse(req.body.Coordinates);
    req.body.Details = JSON.parse(req.body.Details);
    const schema = z.object({
      ContactPerson: z.string(),
      Coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      Details: z.array(
        z.object({
          AvgPriceRange: z.number().nonnegative(),
          Category: z.string(),
          Description: z.string(),
          Facilities: z.array(z.string()),
        }),
      ),
      Email: z.email(),
      Location: z.string(),
      PartnerName: z.string(),
      PartnerType: z.enum(['Hotel', 'Restaurant']),
      Phone: z.string(),
      Status: z.string(),
    });
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[]
    }
    if (!files) throw new BADREQUEST();
    const agencyId = req.user.id;
    const logoFile = files.Logo?.[0];
    const galleryFiles = files.Gallery;
    const data = schema.parse(req.body);
    logger.info('funck you mother fucker')
    const partner = await this._agencyPartnerService.addPartner(data,logoFile,galleryFiles,agencyId);
    const isUpdated = await this._agencyAuthService.updatepartner(agencyId,partner.id)
    if(isUpdated) sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, partner);
    throw new DataUpdatingError()
  }
}

// {"ContactPerson":"Sanju pn",
// "Coordinates":"{\"lat\":11.3890912,\"lng\":75.7604066}",
// "Details":"[{\"AvgPriceRange\":0,\"Category\":\"\",\"Description\":\"\",\"Facilities\":[]}]",
// "Email":"paragon@gamil.com",
// "Location":"Atholi, Kerala 673315, India",
// "Location":"Lat: 11.363460828041633, Lng: 75.7832032182865"
// "PartnerName":"paragon",
// "PartnerType":"Hotel",
// "Phone":"09495806650",
// Invalid input: expected object, received string, Invalid input: expected array, received string
// "Status":"Pending"}
