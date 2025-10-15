import { sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { IHotelProfileController } from '../../core/interface/controllerInterface/hotel/Ihotel.profile.controller.js';
import { inject, injectable } from 'inversify';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { IHotelProfileService } from '../../core/interface/serivice/hotel/Ihotel.profile.service.js';
import z from 'zod';
import { Request, Response } from 'express';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { logger } from '../../utils/logger.js';
import { singleUpload } from '../../utils/upload.cloudinary.js';

@injectable()
export class HotelProfileCotroller implements IHotelProfileController {
  constructor(
    @inject('IHotelAuthRepository') private readonly _hotelAuthRepository: IHotelAuthRepository,
    @inject('IHotelProfileService') private readonly _hoteService: IHotelProfileService
  ) { }

  async getHotelProfile(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const hotel = await this._hotelAuthRepository.findById(user.id);
    if (!hotel) throw new UserNotFoundError();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, hotel);
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      ownerName: z.string(),
      companyName: z.string(),
      phone: z.string(),
      bankDetails: z.object({
        accountHolder: z.string(),
        accountNumber: z.string(),
        bankName: z.string(),
        ifscCode: z.string()
      })
    })
    const { ownerName, phone, companyName, bankDetails } = schema.parse(req.body)
    const user = req.user
    const updatedHotel = await this._hoteService.updateProfile(user.id, { ownerName, companyName, phone: Number(phone), bankDetails })
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedHotel)
  }

  async updateDocument(req: Request, res: Response): Promise<void> {
    const hotelId = req.user.id
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const update = this._hoteService.updateDocuments(hotelId,files)
    update.then((data)=>{
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,data)
    })
  }
}
