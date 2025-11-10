import { Request, Response } from "express";
import { IAgencyPackageController } from "../../core/interface/controllerInterface/agency/Iagencu.package.controller.js";
import { logger } from "../../utils/logger.js";
import { IAgencyPackageService } from "../../core/interface/serivice/agency/Iagency.package.service.js";
import { inject, injectable } from "inversify";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class agencyPackageController implements IAgencyPackageController {
  constructor(
    @inject('IAgencyPackageService') private readonly _packageService: IAgencyPackageService
  ) { }

  async getAllPackages(req: Request, res: Response): Promise<void> {
    const { page } = req.query
    const allPackage = await this._packageService.getAllPackage(Number(page))
    logger.info(allPackage)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allPackage)
  }

  async addPackage(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files) throw new BADREQUEST()
    logger.info('onn vada')
    const createdData = await this._packageService.addPackage(data, files)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, createdData)
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
    logger.info('yup')
    const data = req.body;
    const id = req.params.id
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files) throw new BADREQUEST()
      const updateData = await this._packageService.updatePackage(id,data,files)
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,updateData)
  }
}