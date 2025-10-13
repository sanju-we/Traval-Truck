import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import z from 'zod';
import { logger } from '../../utils/logger.js';
import { IUserProfileController } from '../../core/interface/controllerInterface/user/userProfile.js';
import { IUserProfileService } from '../../core/interface/serivice/user/Iuser.profile.service.js';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { HttpError } from '../../utils/resAndErrors.js';

@injectable()
export class ProfileController implements IUserProfileController {
  constructor(
    @inject('IJWT') private readonly _jwt: IJWT,
    @inject('IAuthRepository') private _authRepository: IAuthRepository,
    @inject('IUserProfileService') private readonly _profileService: IUserProfileService,
  ) { }

  async profile(req: Request, res: Response): Promise<void> {
    if (!req.cookies?.accessToken) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Access token required');
    }

    const { id } = await this._jwt.verify(req.cookies.accessToken);
    const userData = await this._authRepository.findById(id);
    if (!userData) {
      return sendResponse(res, STATUS_CODE.NOT_FOUND, false, 'User not found');
    }

    const user = toUserProfileDTO(userData);
    logger.info(`User profile retrieved for ID ${JSON.stringify(userData)}`);
    sendResponse(res, STATUS_CODE.OK, true, 'User profile found', user)
  }

  async intrest(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      interests: z.array(z.string().min(1)).nonempty(),
    });
    const { interests } = schema.parse(req.body);

    if (!req.user?.id) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'User not authenticated');
    }

    await this._profileService.setInterest(interests, req.user.id);
    logger.info(`Interests updated for user ID ${req.user.id}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED)

  }
  async updateUser(req: Request, res: Response): Promise<void> {
    const schema = z.object({
        name: z.string(),
        userName: z.string(),
        phoneNumber: z.preprocess(
          (val) => Number(val),
          z.number()
        )
    })
    const formData = req.body
    logger.info(`Validated user data: ${JSON.stringify(formData)}`);
    const user = req.user;

    const userData = await this._profileService.updateProfile(formData, user)
    logger.info(`userData : ${userData}`)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, userData)
  }
}