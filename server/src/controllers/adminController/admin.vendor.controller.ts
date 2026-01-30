import { IAdminVendorController } from '../../core/interface/controllerInterface/admin/Iadmin.vendor.controller';
import { sendResponse } from '../../utils/resAndErrors';
import { HttpError } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { IAdminVendorRepository } from '../../core/interface/repositorie/admin/Iadmin.vendor.repository';
import { IAdminVendorService } from '../../core/interface/serivice/admin/IAdmin.vendor.service';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { MESSAGES } from '../../utils/responseMessaages';

@injectable()
export class AdminVendorController implements IAdminVendorController {
  constructor(
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IAdminVendorRepository') private readonly _adminVenderRepo: IAdminVendorRepository,
    @inject('IAdminVendorService') private readonly _adminVenderService: IAdminVendorService,
  ) { }

  async showAllRequsestes(req: Request, res: Response): Promise<void> {
    const search = req.query.search
    const allReq = await this._adminVenderRepo.findAllRequests(search != undefined ? String(search) : undefined);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allReq);
  }

  async showAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';
      // Force role 'user' for this endpoint as per requirement
      const role = 'user';

      const { data, total, totalPages } = await this._adminVenderRepo.findAllUsers(page, limit, status, role, search);

      sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, {
        data,
        total,
        page,
        totalPages,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, false, 'Something went wrong.');
    }
  }

  async getAllAgency(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const { data, total, totalPages } = await this._adminVenderService.getAllAgency(page, limit, search, status)

      sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, {
        data,
        total,
        page,
        totalPages
      })
    } catch (error) {
      console.error('Error fetching agencies:', error);
      sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, false, 'Something went wrong.');
    }
  }

  async getAllHotels(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const { data, total, totalPages } = await this._adminVenderService.getAllHotels(page, limit, search, status)

      sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, {
        data,
        total,
        page,
        totalPages
      })
    } catch (error) {
      console.error('Error fetching hotels:', error);
      sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, false, 'Something went wrong.');
    }
  }

  async getAllRestaurants(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const { data, total, totalPages } = await this._adminVenderService.getAllRestaurants(page, limit, search, status)

      sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, {
        data,
        total,
        page,
        totalPages
      })
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      sendResponse(res, STATUS_CODE.INTERNAL_SERVER_ERROR, false, 'Something went wrong.');
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { reason } = req.body;
    const { id, action, role } = req.params;
    await this._adminVenderService.updateStatus(id, action, role, reason);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.APPROVED);
  }

  async blockTongle(req: Request, res: Response): Promise<void> {
    const { id, role } = req.params;
    await this._adminVenderService.updateBlock(id, role);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED);
  }

  async sortUsers(req: Request, res: Response): Promise<void> {
    const { sort, status } = req.query;
    const data = await this._adminVenderService;
  }
}
