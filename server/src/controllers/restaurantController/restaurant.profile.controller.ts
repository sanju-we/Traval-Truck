import { Request, Response } from 'express';
import { IRestaurantProfileController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.profile.controller';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository';
import { inject, injectable } from 'inversify';
import { BADREQUEST, DataUpdatingError, sendResponse, UserNotFoundError } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/responseMessaages';
import { IRestaurantProfileService } from '../../core/interface/serivice/restaurant/IRestaurant.profile.service';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';

@injectable()
export class RestaurantProfileController implements IRestaurantProfileController {
  constructor(
    @inject('IRestaurantAuthRepository') private readonly _restaurantAuthRepository: IRestaurantAuthRepository,
    @inject('IRestaurantProfileService') private readonly _restaurantProfileService: IRestaurantProfileService,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator,
  ) { }
  async getRestaurant(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const restaurant = await this._restaurantAuthRepository.findById(user.id);
    if (!restaurant) throw new UserNotFoundError();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, toVendorRequestDTO(restaurant));
  }

  async getdashboard(req: Request, res: Response): Promise<void> {
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const { ownerName, phone, companyName, address } = req.body
    const bankDetails = req.body.bankDetails || {
      accountHolder: req.body['bankDetails.accountHolder'],
      accountNumber: req.body['bankDetails.accountNumber'],
      bankName: req.body['bankDetails.bankName'],
      ifscCode: req.body['bankDetails.ifscCode'],
    };
    await this._authValidator.profileUpdateValidator(ownerName, companyName, phone, bankDetails)
    const restaunratId = req.user.id;

    const updateRestaurant = await this._restaurantProfileService.updateProfile(restaunratId, {
      ownerName,
      companyName,
      address,
      phone: Number(phone),
      bankDetails: bankDetails as any,
    });
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateRestaurant);
  }

  async updateDocuments(req: Request, res: Response): Promise<void> {
    const restaurantId = req.user.id;
    const restricted = req.user.isRestricted;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const update = this._restaurantProfileService.updateDocuments(restaurantId, files);
    if (!update) throw new DataUpdatingError();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, update)
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    const { documentUrl, key } = req.body;
    const restaurantId = req.user.id;
    const restaurant = await this._restaurantProfileService.deleteImage(
      restaurantId,
      documentUrl,
      key,
    );
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, restaurant);
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    const image = req.file;
    if (!image) throw new BADREQUEST();
    const restaurantId = req.user.id;
    const updated = await this._restaurantProfileService.uploadImage(restaurantId, image);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updated);
  }
}
