import { Request, Response } from "express";
import { IAgencyPackageController } from "../../core/interface/controllerInterface/agency/Iagencu.package.controller.js";
import { logger } from "../../utils/logger.js";
import { IAgencyPackageService } from "../../core/interface/serivice/agency/Iagency.package.service.js";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class agencyPackageController implements IAgencyPackageController {
  constructor(
    @inject('IAgencyPackageService') private readonly _packageService : IAgencyPackageService
  ) { }

  async getAllPackages(req: Request, res: Response): Promise<void> {
    const {page} = req.query
      const allPackage = await this._packageService.getAllPackage(Number(page))
      logger.info(allPackage)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ALL_DATA_FOUND,allPackage)
  }

  async addPackage(req: Request, res: Response): Promise<void> {
      const data = req.body
      const createdData = await this._packageService.addPackage(data)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.CREATED,createdData)
  }
}