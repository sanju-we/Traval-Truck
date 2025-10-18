import { IAdminVendorController } from '../../core/interface/controllerInterface/admin/Iadmin.vendor.controller.js';
import z from 'zod';
import { logger } from '../../utils/logger.js';
import { sendResponse } from '../../utils/resAndErrors.js';
import { HttpError } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { IAdminVendorRepository } from '../../core/interface/repositorie/admin/Iadmin.vendor.repository.js';
import { IAdminVendorService } from '../../core/interface/serivice/admin/IAdmin.vendor.service.js';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { MESSAGES } from '../../utils/responseMessaages.js';

@injectable()
export class AdminVendorController implements IAdminVendorController {
  constructor(
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IAdminVendorRepository') private readonly _adminVenderRepo: IAdminVendorRepository,
    @inject('IAdminVendorService') private readonly _adminVenderService: IAdminVendorService,
  ) {}

  async showAllRequsestes(req: Request, res: Response): Promise<void> {
    const allReq = await this._adminVenderRepo.findAllRequests();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allReq);
  }

  async showAllUsers(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const { data, total, totalPages } = await this._adminVenderRepo.findAllUsers(page, limit);

    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, {
      data,
      total,
      page,
      totalPages,
    });
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      id: z.string(),
      action: z.enum(['approve', 'reject']),
      role: z.enum(['agency', 'hotel', 'restaurant']),
    });
    const bosySchema = z.object({
      reason: z.string().nullable()
    })
    const {reason} =bosySchema.parse(req.body)
    const { id, action, role } = schema.parse(req.params);
    logger.info('*****************')
    await this._adminVenderService.updateStatus(id, action, role,reason);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.APPROVED);
  }

  async blockTongle(req: Request, res: Response): Promise<void> {
    logger.info(`request got in here role:`);
    const schema = z.object({
      id: z.string(),
      role: z.string(),
    });
    const { id, role } = schema.parse(req.params);
    await this._adminVenderService.updateBlock(id, role);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED);
  }

  async sortUsers(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      sort: z.string(),
      status: z.string(),
    });
    const { sort, status } = schema.parse(req.query);
    const data = await this._adminVenderService;
  }
}
