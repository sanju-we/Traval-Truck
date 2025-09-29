import { IUserProfileService } from '../../core/interface/serivice/user/Iuser.profile.service.js';
import { inject, injectable } from 'inversify';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import z, { string } from 'zod';
import { userEdit, Userauth } from 'types/index.js';
import { UserNotFoundError } from '../../utils/resAndErrors.js';
import { IUser } from 'types';

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(@inject('IAuthRepository') private readonly _authRespository: IAuthRepository) { }

  async setInterest(interests: string[], id: string): Promise<void> {
    const schema = z.object({
      interests: z.array(z.string()),
      id: z.string(),
    });
    schema.parse({ interests, id });
    await this._authRespository.findByIdAndUpdateAction(id, interests, 'interest');
  }

  async updateProfile(formData: userEdit, user: Userauth): Promise<IUser | null> {
    const userData = await this._authRespository.findById(user.id)
    if (!userData) throw new UserNotFoundError()

    const updateUser = await this._authRespository.findByIdAndUpdateProfile(userData.id, formData)
    if (!updateUser) throw new UserNotFoundError()

    return updateUser
  }
}
