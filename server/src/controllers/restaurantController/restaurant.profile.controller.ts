import { Request, Response } from 'express';
import { IRestaurantProfileController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.profile.controller.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { inject, injectable } from 'inversify';
import { BADREQUEST, sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { IRestaurantProfileService } from '../../core/interface/serivice/restaurant/IRestaurant.profile.service.js';
import { logger } from '../../utils/logger.js';
import z from 'zod';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

@injectable()
export class RestaurantProfileController implements IRestaurantProfileController {
  constructor(
    @inject('IRestaurantAuthRepository')
    private readonly _restaurantAuthRepository: IRestaurantAuthRepository,
    @inject('IRestaurantProfileService')
    private readonly _restaurantProfileService: IRestaurantProfileService,
  ) {}
  async getRestaurant(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const restaurant = await this._restaurantAuthRepository.findById(user.id);
    if (!restaurant) throw new UserNotFoundError();
    sendResponse(res, STATUS_CODE.OK, true,MESSAGES.SUCCESS, toVendorRequestDTO(restaurant));
  }

  async getdashboard(req: Request, res: Response): Promise<void> {
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
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

    const { ownerName, phone, companyName, bankDetails } = schema.parse(req.body);
    const restaunratId = req.user.id;

    const updateRestaurant = await this._restaurantProfileService.updateProfile(restaunratId, {
      ownerName,
      companyName,
      phone: Number(phone),
      bankDetails,
    });
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateRestaurant);
  }

  async updateDocuments(req: Request, res: Response): Promise<void> {
    const restaurantId = req.user.id;
    const restricted = req.user.isRestricted
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const update = this._restaurantProfileService.updateDocuments(restaurantId, files);
    update.then((data) => {
      sendResponse(res, STATUS_CODE.OK, true, restricted ? MESSAGES.RESUBMITED : MESSAGES.SUCCESS, data);
    });
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
      const {documentUrl,key} = req.body
      const restaurantId = req.user.id
      const restaurant = await this._restaurantProfileService.deleteImage(restaurantId,documentUrl,key)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DELETED,restaurant)
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
      const image = req.file
      if(!image) throw new BADREQUEST()
        const restaurantId = req.user.id;
      const updated = await this._restaurantProfileService.uploadImage(restaurantId,image)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,updated)
  }
}
