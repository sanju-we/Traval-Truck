import { IAdminVendorRepository } from '../../core/interface/repositorie/admin/Iadmin.vendor.repository.js';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { inject, injectable } from 'inversify';
import { logger } from '../../utils/logger.js';
import { vendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { userProfileDTO } from 'types';

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
    const hotelDatas = await this._hotelRepository.findAllRequest();
    const agencyDatas = await this._agencyRepository.findAllRequest();
    const restaurantDatas = await this._restaurantRepository.findAllRequest();
    logger.info(`hotelData : ${hotelDatas}`);

    const allData = [...hotelDatas, ...agencyDatas, ...restaurantDatas];
    return allData;
  }

  async findAllUsers(page: number = 1, limit: number = 10): Promise<{
  data: (vendorRequestDTO | userProfileDTO)[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const userData = await this._userRepository.findAll();
  const agencyData = await this._agencyRepository.findAll();
  const hotelData = await this._hotelRepository.findAll();
  const restaurantData = await this._restaurantRepository.findAll();

  const allUsers = [...userData, ...agencyData, ...hotelData, ...restaurantData];

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
