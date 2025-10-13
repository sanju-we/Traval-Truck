import { IAgencyProfileController } from '../../core/interface/controllerInterface/agency/Iagency.profile.controller.js';
import { inject, injectable } from 'inversify';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { Request, Response } from 'express';
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';

@injectable()
export class AgencyProfileController implements IAgencyProfileController {
  constructor(
    @inject('IAgencyRespository') private readonly _agencyRepository: IAgencyRespository,
  ) {}
  async getAgency(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const agency = await this._agencyRepository.findById(user.id);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, agency);
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
  }
}
