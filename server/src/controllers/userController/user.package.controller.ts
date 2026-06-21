import { IUserPackageController } from "../../core/interface/controllerInterface/user/Iuser.package.controller";
import { IUserPackageService } from "../../core/interface/serivice/user/IUser.package.service";
import { inject, injectable } from "inversify";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors";
import { MESSAGES } from "../../utils/responseMessaages";
import { Request, Response } from "express";

@injectable()
export class UserPackageController implements IUserPackageController {
  constructor(
    @inject('IUserPackageService') private readonly _userPackageService: IUserPackageService
  ) { }
  async getLatestPackage(req: Request, res: Response): Promise<void> {
    const data = await this._userPackageService.getLatestPackage()
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }

  async getAllPackage(req: Request, res: Response): Promise<void> {
    const { page, limit, search, price, duration, sortBy } = req.query
    if (!page || !limit) throw new BADREQUEST()
    const data = await this._userPackageService.getAllPackage(
      Number(page), 
      Number(limit), 
      search != undefined ? String(search) : '',
      price != undefined ? String(price) : undefined,
      duration != undefined ? String(duration) : undefined,
      sortBy != undefined ? String(sortBy) : undefined
    )
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }

  async getPackage(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    if (!id) throw new BADREQUEST()
    const data = await this._userPackageService.getPackage(String(id))
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, data)
  }

  async puchasePackage(req: Request, res: Response): Promise<void> {
    const { packageId, amount, couponId, maxPeople } = req.body
    const userId = req.user.id
    const role = req.user.role
    const session = await this._userPackageService.initiativePurchase(packageId, userId, role, amount, couponId, maxPeople)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ACTIVATED, session)
  }

  async getCoupons(req: Request, res: Response): Promise<void> {
    const userId = req.user.id
    const coupons = await this._userPackageService.getAllCoupons(userId)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, coupons)
  }

  async walletPurchase(req: Request, res: Response): Promise<void> {
    const { productId, amount, people, couponId, productType } = req.body
    const userId = req.user.id;
    const result = await this._userPackageService.walletPurchase(userId, productId, people, amount, productType, couponId);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, result);
  }
}