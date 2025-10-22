import { Request, Response } from "express";
import { IAdminSubscriptionController } from "../../core/interface/controllerInterface/admin/Iadmin.subscription.controller.js";
import { inject, injectable } from "inversify";
import { logger } from "../../utils/logger.js";
import z from "zod";
import { IAdminSubscriptionService } from "../../core/interface/serivice/admin/IAdmin.subscription.service.js";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class AdminSubscriptionController implements IAdminSubscriptionController {
  constructor(
    @inject('IAdminSubscriptionService') private readonly _adminSubcriptionService: IAdminSubscriptionService
  ) { }

  async addSubscription(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      Name: z.string().min(3),
      Amount: z.number().gt(0),
      Category: z.string(),
      Description: z.string().min(10),
      Duration: z.object({
        startingDate: z.string(),
        endingDate: z.string(),
      }),
      Features: z.array(z.string().min(3)),
      Valid: z.number().gt(0)
    })
    const formData = schema.parse(req.body)
    const data = await this._adminSubcriptionService.addSub(formData)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, data)
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const data = await this._adminSubcriptionService.getAllSubscriptions()
    logger.info('data that getting from the service', data);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }

  async updateSubscription(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      Name: z.string().min(3),
      Amount: z.number().gt(0),
      Category: z.string(),
      Description: z.string().min(10),
      Duration: z.object({
        startingDate: z.string(),
        endingDate: z.string(),
      }),
      Features: z.array(z.string().min(3)),
      Valid: z.number().gt(0)
    })
    const formData = schema.parse(req.body)
    const id = req.params.id
    const data = await this._adminSubcriptionService.editSubscription(formData, id)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, data)
  }

  async tonggleStatus(req: Request, res: Response): Promise<void> {
      const id = req.params.id;
      const update = await this._adminSubcriptionService.tonggleStatusService(id)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,update)
  }
}