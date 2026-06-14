import { Request, Response } from "express";
import { IAgencyPackageController } from "../../core/interface/controllerInterface/agency/Iagencu.package.controller";
import { IAgencyPackageService } from "../../core/interface/serivice/agency/Iagency.package.service";
import { inject, injectable } from "inversify";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";

@injectable()
export class agencyPackageController implements IAgencyPackageController {
  constructor(
    @inject('IAgencyPackageService') private readonly _packageService: IAgencyPackageService
  ) { }

  async getAllPackages(req: Request, res: Response): Promise<void> {
    const { page, limit, search, price, duration, sortBy } = req.query;
    const agencyId = req.user.id;
    const allPackage = await this._packageService.getAllPackage(
      page ? Number(page) : 1,
      limit ? Number(limit) : 6,
      search ? String(search) : undefined,
      agencyId,
      price ? String(price) : undefined,
      duration ? String(duration) : undefined,
      sortBy ? String(sortBy) : undefined
    );
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allPackage);
  }

  async addPackage(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const id = req.user.id
    const files = req.files as Express.Multer.File[];
    if (!files) throw new BADREQUEST()
    const createdData = await this._packageService.addPackage(data, files, id)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, createdData)
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const id = req.params.id
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files) throw new BADREQUEST()
      const updateData = await this._packageService.updatePackage(id,data,files)
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,updateData)
  }

  async deleteSingleImage(req: Request, res: Response): Promise<void> {
      const index = req.body.index;
      const id = req.params.id;
      const updated = await this._packageService.deleteImage(id,index);
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DELETED,updated);
  }
}