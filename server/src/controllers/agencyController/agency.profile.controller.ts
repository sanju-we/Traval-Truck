import { IAgencyProfileController } from '../../core/interface/controllerInterface/agency/Iagency.profile.controller.js';
import { inject, injectable } from 'inversify';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { Request, Response } from 'express';
import { BADREQUEST, sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { IAgencyProfileService } from '../../core/interface/serivice/agency/Iagenc.profile.service.js';
import z from 'zod';

@injectable()
export class AgencyProfileController implements IAgencyProfileController {
  constructor(
    @inject('IAgencyRespository') private readonly _agencyRepository: IAgencyRespository,
    @inject('IAgencyProfileService') private readonly _agencyProfileService: IAgencyProfileService,
  ) {}
  async getAgency(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const agency = await this._agencyRepository.findById(user.id);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, agency);
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
  }

  async update(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      ownerName: z.string(),
      companyName: z.string(),
      phone: z.string(),
      bankDetails: z.object({
        accountHolder: z.string(),
        accountNumber: z.string(),
        bankName: z.string(),
        ifscCode: z.string(),
      }),
    });
    const { ownerName, companyName, phone, bankDetails } = schema.parse(req.body);
    const agencyId = req.user.id;
    const updatedAgency = await this._agencyProfileService.updateProfile(agencyId, {
      ownerName,
      companyName,
      phone: Number(phone),
      bankDetails,
    });
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedAgency);
  }

  async updateDocument(req: Request, res: Response): Promise<void> {
    const agencyId = req.user.id;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    if (!files) throw new BADREQUEST();

    const update = this._agencyProfileService.updateDocument(agencyId, files);
    update.then((data) => {
      sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, data);
    });
  }
}
