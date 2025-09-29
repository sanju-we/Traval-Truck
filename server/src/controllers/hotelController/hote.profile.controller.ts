import { sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { IHotelProfileController } from '../../core/interface/controllerInterface/hotel/Ihotel.profile.controller.js';
import { inject, injectable } from 'inversify';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { Request, Response } from 'express';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';

@injectable()
export class HotelProfileCotroller implements IHotelProfileController {
  constructor(
    @inject('IHotelAuthRepository') private readonly _hotelAuthRepository: IHotelAuthRepository,
  ) {}

  async getHotelProfile(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const hotel = await this._hotelAuthRepository.findById(user.id);
    if (!hotel) throw new UserNotFoundError();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, hotel);
  }
}
