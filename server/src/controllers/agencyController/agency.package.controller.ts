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

// "availableFoods":["sdf","dfs","biriyani"],
// "description":"sdfsdfsdf",
// "dining":["6900ecf9c482d9836423a687","6900ec12c482d9836423a661"],
// "discoveries":["sdf","ds"],
// "duration":"5 days ",
// "hotels":["6900e91cc482d9836423a607"],
// "itinerary":[{"activities":["set-up the hotel ","visit kappad beach"],"day":1,"title":"Arriving"}],
// "price":"15000",
// "title":"Jilla"