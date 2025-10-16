import { IAdminVendorService } from '../../core/interface/serivice/admin/IAdmin.vendor.service.js';
import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import z from 'zod';
import { InvalidAction, UserNotFoundError } from '../../utils/resAndErrors.js';
import { logger } from '../../utils/logger.js';

@injectable()
export class AdminVendorService implements IAdminVendorService {
  constructor(
    @inject('IAuthRepository') private readonly _userRepository: IAuthRepository,
    @inject('IAgencyRespository') private readonly _agencyrepository: IAgencyRespository,
    @inject('IHotelAuthRepository') private readonly _hotelRepository: IHotelAuthRepository,
    @inject('IRestaurantAuthRepository')
    private readonly _restaurantRepository: IRestaurantAuthRepository,
  ) {}

  async updateStatus(id: string, action: string, role: string): Promise<void> {
    const schema = z.object({
      id: z.string(),
      action: z.enum(['approve', 'reject']),
      role: z.enum(['agency', 'hotel', 'restaurant']),
    });
    schema.parse({ id, action, role });
    let vendor;
    if (role === 'agency') {
      vendor = await this._agencyrepository.findById(id);
    } else if (role === 'hotel') {
      logger.info(`ivda eththi tto`);
      vendor = await this._hotelRepository.findById(id);
    } else {
      vendor = await this._restaurantRepository.findById(id);
    }

    if (!vendor) throw new UserNotFoundError();

    if (action === 'approve' && vendor.isApproved === true) {
      throw new InvalidAction();
    } else if (action === 'reject' && vendor.isRestricted === true) {
      throw new InvalidAction();
    }

    const field = action === 'approve' ? 'isApproved' : 'isRestricted';

    const repo =
      role === 'agency'
        ? this._agencyrepository
        : role === 'hotel'
          ? this._hotelRepository
          : this._restaurantRepository;

    await repo.findByIdAndUpdateAction(id, true, field);
  }

  async updateBlock(id: string, role: string): Promise<void> {
    const schema = z.object({
      id: z.string(),
      role: z.string(),
    });
    schema.parse({ id, role });
    let user;
    if (role === 'user') {
      user = await this._userRepository.findById(id);
      if (!user) throw new UserNotFoundError();
      await this._userRepository.findByIdAndUpdateAction(id, !user.isBlocked, 'isBlocked');
    } else if (role === 'agency') {
      user = await this._agencyrepository.findById(id);
      if (!user) throw new UserNotFoundError();
      await this._agencyrepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
    } else if (role === 'hotel') {
      user = await this._hotelRepository.findById(id);
      if (!user) throw new UserNotFoundError();
      await this._hotelRepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
    } else {
      user = await this._restaurantRepository.findById(id);
      if (!user) throw new UserNotFoundError();
      await this._restaurantRepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
    }
  }
}
