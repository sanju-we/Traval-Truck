import { PackageDTO } from "@core/DTO/agency/request/packageDTO.js";
import { IUserPackageController } from "../../core/interface/controllerInterface/user/Iuser.package.controller.js";
import { IUserPackageService } from "../../core/interface/serivice/user/IUser.package.service.js";
import { inject, injectable } from "inversify";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
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
    const { page, limit } = req.query
    const search = req.query.search
    if(!page || !limit) throw new BADREQUEST()
    const data = await this._userPackageService.getAllPackage(Number(page), Number(limit),search != undefined ? String(search) : '')
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }

  async getPackage(req: Request, res: Response): Promise<void> {
      const id = req.params.id
      if(!id) throw new BADREQUEST()
      const data = await this._userPackageService.getPackage(String(id))
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DATA_FOUND,data)
  }

  async puchasePackage(req: Request, res: Response): Promise<void> {
      const {packageId,amount,couponId} = req.body
      const userId = req.user.id
      const role = req.user.role
      const session = await this._userPackageService.initiativePurchase(packageId,userId,role,amount,couponId)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ACTIVATED,session)
  }

  async getCoupons(req: Request, res: Response): Promise<void> {
    const userId = req.user.id
    const coupons = await this._userPackageService.getAllCoupons(userId)
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ALL_DATA_FOUND,coupons)
  }
}