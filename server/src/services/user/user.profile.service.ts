import { IUserProfileService } from '../../core/interface/serivice/user/Iuser.profile.service';
import { inject, injectable } from 'inversify';
import { IAuthRepository } from '../../core/interface/repositorie/User/IAuth.Repository';
import { userEdit, Userauth } from 'types/index';
import { PasswordMismatchError, UserNotFoundError } from '../../utils/resAndErrors';
import { IUser } from 'types';
import { singleUpload } from '../../utils/upload.cloudinary';
import { userProfileDTO } from '../../core/DTO/user/Response/user.profile';
import { IBaseValidator } from '../../core/interface/validator/IBasic.validator';
import { IAuthValidator } from '@core/interface/validator/Iauth.validator';
import bcrypt from 'bcryptjs';
import { IUserMapper } from '../../core/interface/mapper/IUserMapper';

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject('IAuthRepository') private readonly _authRespository: IAuthRepository,
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator,
    @inject('IUserMapper') private readonly _userMapper : IUserMapper,
  ) { }

  async setInterest(interests: string[], id: string): Promise<void> {
    await this._baseValidator.InterestValidator(interests, id)
    await this._authRespository.findByIdAndUpdateAction(id, interests, 'interest');
  }

  async updateProfile(formData: userEdit, user: Userauth): Promise<IUser | null> {
    const userData = await this._authRespository.findById(user.id);
    if (!userData) throw new UserNotFoundError();

    let updateUser;

    if (formData.oldPassword && formData.newPassword) {
      const isMatch = await bcrypt.compare(formData.oldPassword, userData.password);
      if (!isMatch) throw new PasswordMismatchError();
      await this._authValidator.passwordValidator(formData.newPassword)
      const hashedPassword = await bcrypt.hash(formData.newPassword, 10);
      formData.newPassword = hashedPassword;
      updateUser = await this._authRespository.findByIdAndUpdateProfile(userData.id, { ...formData, password: formData.newPassword });
    } else {
      updateUser = await this._authRespository.findByIdAndUpdateProfile(userData.id, formData);
    }

    if (!updateUser) throw new UserNotFoundError();

    return updateUser;
  }

  async uploadProfileImage(id: string, image: Express.Multer.File): Promise<userProfileDTO | null> {
    const result = await singleUpload(image, 'Travel-Truck-Document');

    const update = await this._authRespository.update(id, { profilePicture: result });
    if (update) return await this._userMapper.toUserProfileDTO(update);
    return null;
  }
}
