import { IAdminVendorRepository } from '../../core/interface/repositorie/admin/Iadmin.vendor.repository.js';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { inject, injectable } from 'inversify';
import { logger } from '../../utils/logger.js';
import {
  vendorRequestDTO,
  toVendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { userProfileDTO } from 'types';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';

@injectable()
export class AdminVendorRepository implements IAdminVendorRepository {
  constructor(
    @inject('IRestaurantAuthRepository')
    private readonly _restaurantRepository: IRestaurantAuthRepository,
    @inject('IHotelAuthRepository') private readonly _hotelRepository: IHotelAuthRepository,
    @inject('IAgencyRespository') private readonly _agencyRepository: IAgencyRespository,
    @inject('IAuthRepository') private readonly _userRepository: IAuthRepository,
  ) {}
  async findAllRequests(): Promise<vendorRequestDTO[]> {
  const hotelDatas = await this._hotelRepository.findAllUser({ isApproved: false }, {});
  const agencyDatas = await this._agencyRepository.findAllUser({ isApproved: false }, {});
  const restaurantDatas = await this._restaurantRepository.findAllUser({ isApproved: false }, {});
  logger.info(`hotelData : ${hotelDatas}`);

  const allData = [...hotelDatas, ...agencyDatas, ...restaurantDatas];

  const completeData = allData.filter((item) => {
    const bank = item.bankDetails;
    return bank &&
      bank.accountNumber &&
      bank.ifscCode &&
      bank.bankName &&
      bank.accountHolder;
  });

  return completeData.map(toVendorRequestDTO);
}


  async findAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: (vendorRequestDTO | userProfileDTO)[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const userData = await this._userRepository.findAllUser({}, {});
    const agencyData = await this._agencyRepository.findAllUser({ isApproved: true }, {});
    const hotelData = await this._hotelRepository.findAllUser({ isApproved: true }, {});
    const restaurantData = await this._restaurantRepository.findAllUser({ isApproved: true }, {});

    const vendorDTO: vendorRequestDTO[] = [
      ...agencyData.map(toVendorRequestDTO),
      ...hotelData.map(toVendorRequestDTO),
      ...restaurantData.map(toVendorRequestDTO),
    ];
    const allUserDTO = [...userData.map(toUserProfileDTO)];
    const allUsers = [...allUserDTO, ...vendorDTO];

    const total = allUsers.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = allUsers.slice(start, end);

    return {
      data: paginated,
      total,
      page,
      totalPages,
    };
  }
}
