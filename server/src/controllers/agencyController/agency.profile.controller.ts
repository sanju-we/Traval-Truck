import { IAgencyProfileController } from '../../core/interface/controllerInterface/agency/Iagency.profile.controller';
import { inject, injectable } from 'inversify';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository';
import { Request, Response } from 'express';
import { BADREQUEST, sendResponse, UserNotFoundError } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/responseMessaages';
import { IAgencyProfileService } from '../../core/interface/serivice/agency/Iagenc.profile.service';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto';

@injectable()
export class AgencyProfileController implements IAgencyProfileController {
  constructor(
    @inject('IAgencyRespository') private readonly _agencyRepository: IAgencyRespository,
    @inject('IAgencyProfileService') private readonly _agencyProfileService: IAgencyProfileService,
  ) { }
  async getAgency(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const agency = await this._agencyRepository.findById(user.id);
    if (!agency) throw new UserNotFoundError();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, toVendorRequestDTO(agency));
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { ownerName, companyName, phone, address } = req.body;

    // Extract bankDetails from flat structure if sent via FormData
    const bankDetails = req.body.bankDetails || {
      accountHolder: req.body['bankDetails.accountHolder'],
      accountNumber: req.body['bankDetails.accountNumber'],
      bankName: req.body['bankDetails.bankName'],
      ifscCode: req.body['bankDetails.ifscCode'],
    };

    const agencyId = req.user.id;
    const updatedAgency = await this._agencyProfileService.updateProfile(agencyId, {
      ownerName,
      companyName,
      address,
      phone: Number(phone),
      bankDetails: bankDetails as {
        accountHolder: string;
        accountNumber: string;
        bankName: string;
        ifscCode: string;
      },
    });
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedAgency);
  }

  async updateDocument(req: Request, res: Response): Promise<void> {
    const agencyId = req.user.id;
    const restricted = req.user.isRestricted;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    if (!files) throw new BADREQUEST();

    const update = this._agencyProfileService.updateDocument(agencyId, files);
    update.then((data) => {
      sendResponse(
        res,
        STATUS_CODE.OK,
        true,
        restricted ? MESSAGES.RESUBMITED : MESSAGES.SUCCESS,
        data,
      );
    });
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    const agencyId = req.user.id;
    const { documentUrl, key } = req.body;
    if (!documentUrl) throw new BADREQUEST();
    const agency = await this._agencyProfileService.deleteImage(agencyId, documentUrl, key);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, agency);
  }

  async uploadProfile(req: Request, res: Response): Promise<void> {
    const agencyId = req.user.id;
    const profile = req.file;
    if (!profile) throw new BADREQUEST();
    const result = await this._agencyProfileService.uploadProfile(agencyId, profile);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, result);
  }
}
