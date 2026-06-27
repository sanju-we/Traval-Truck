import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { BADREQUEST, sendResponse } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { IAuthRepository } from '../../core/interface/repositorie/User/IAuth.Repository';
import { IUserProfileController } from '../../core/interface/controllerInterface/user/userProfile';
import { IUserProfileService } from '../../core/interface/serivice/user/Iuser.profile.service';
import { MESSAGES } from '../../utils/responseMessaages';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';
import { IBaseValidator } from '../../core/interface/validator/IBasic.validator';
import { IUserMapper } from '../../core/interface/mapper/IUserMapper';

@injectable()
export class ProfileController implements IUserProfileController {
  constructor(
    @inject('IJWT') private readonly _jwt: IJWT,
    @inject('IAuthRepository') private _authRepository: IAuthRepository,
    @inject('IUserProfileService') private readonly _profileService: IUserProfileService,
    @inject('IBaseValidator') private readonly _baseValidator : IBaseValidator,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator,
    @inject('IUserMapper') private readonly _userMapper : IUserMapper,
  ) {}

  async profile(req: Request, res: Response): Promise<void> {
    if (!req.cookies?.accessToken) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Access token required');
    }

    const { id } = await this._jwt.verify(req.cookies.accessToken);
    const userData = await this._authRepository.findById(id);
    if (!userData) {
      return sendResponse(res, STATUS_CODE.NOT_FOUND, false, 'User not found');
    }

    const user = await this._userMapper.toUserProfileDTO(userData);
    sendResponse(res, STATUS_CODE.OK, true, 'User profile found', user);
  }

  async intrest(req: Request, res: Response): Promise<void> {
    const { interests } = req.body;
    await this._baseValidator.InterestValidator(interests)

    if (!req.user?.id) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'User not authenticated');
    }

    await this._profileService.setInterest(interests, req.user.id);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED);
  }
  async updateUser(req: Request, res: Response): Promise<void> {
    const formData = req.body;
    const user = req.user;
    const userData = await this._profileService.updateProfile(formData, user);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, userData);
  }

  async uploadProfile(req: Request, res: Response): Promise<void> {
    const profile = req.file;
    if (!profile) throw new BADREQUEST();
    const userId = req.user.id;
    const updated = await this._profileService.uploadProfileImage(userId, profile);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updated);
  }
}
