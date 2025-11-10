import { IAdminCouponController } from "../../core/interface/controllerInterface/admin/Iadmin.coupon.controller.js";
import { Request, Response } from "express";
import { IAdminCouponService } from "../../core/interface/serivice/admin/IAdmin.coupon.service.js";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class AdminCouponController implements IAdminCouponController {
  constructor(
    @inject('IAdminCouponService') private readonly _couponService: IAdminCouponService
  ) { }

  async getAll(req: Request, res: Response): Promise<void> {
    const page = req.query.page
    const data = await this._couponService.getAllCoupon(page ? Number(page) : 1)
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ALL_DATA_FOUND,data)
  }

  async add(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const coupon = await this._couponService.addCoupon(data)
    sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, coupon)
  }

  async update(req: Request, res: Response): Promise<void> {
      const data = req.body;
      const id = req.params.id;
      const updatedCoupon = await this._couponService.updateCoupon(id,data)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,updatedCoupon)
  }

  async tongleStatus(req: Request, res: Response): Promise<void> {
      const id = req.params.id;
      const updatedData = await this._couponService.updateCouponStatus(id)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,updatedData)
  }
}