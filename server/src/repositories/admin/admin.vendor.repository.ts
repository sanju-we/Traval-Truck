import { IAdminVendorRepository } from '../../core/interface/repositorie/admin/Iadmin.vendor.repository';
import { IAuthRepository } from '../../core/interface/repositorie/User/IAuth.Repository';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository';
import { inject, injectable } from 'inversify';
import { logger } from '../../utils/logger';
import {
  vendorRequestDTO,
  toVendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { userProfileDTO } from 'types';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile';

@injectable()
export class AdminVendorRepository implements IAdminVendorRepository {
  constructor(
    @inject('IRestaurantAuthRepository')
    private readonly _restaurantRepository: IRestaurantAuthRepository,
    @inject('IHotelAuthRepository') private readonly _hotelRepository: IHotelAuthRepository,
    @inject('IAgencyRespository') private readonly _agencyRepository: IAgencyRespository,
    @inject('IAuthRepository') private readonly _userRepository: IAuthRepository,
  ) { }
  async findAllRequests(search?: string): Promise<vendorRequestDTO[]> {
    const searchFilter = search
      ? {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { ownerName: { $regex: search, $options: 'i' } },
        ],
      }
      : {};
    const [hotelDatas, agencyDatas, restaurantDatas] = await Promise.all([
      this._hotelRepository.findAll({ isApproved: false, ...searchFilter }, {}),
      this._agencyRepository.findAll({ isApproved: false, ...searchFilter }, {}),
      this._restaurantRepository.findAll({ isApproved: false, ...searchFilter }, {}),
    ]);

    logger.info(`vendorData : ${JSON.stringify(hotelDatas)}`);

    const allData = [...hotelDatas, ...agencyDatas, ...restaurantDatas];

    const completeData = allData.filter((item) => {
      const bank = item.bankDetails;
      return (
        bank &&
        bank.accountNumber &&
        bank.ifscCode &&
        bank.bankName &&
        bank.accountHolder
      );
    });

    return completeData.map(toVendorRequestDTO);
  }

  async findAllUsers(
    page: number,
    limit: number,
    status: string,
    role: string,
    search: string
  ): Promise<{
    data: (vendorRequestDTO | userProfileDTO)[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const userData = await this._userRepository.findAll({}, {});
    const agencyData = await this._agencyRepository.findAll({ isApproved: true }, {});
    const hotelData = await this._hotelRepository.findAll({ isApproved: true }, {});
    const restaurantData = await this._restaurantRepository.findAll({ isApproved: true }, {});

    const vendorDTO: vendorRequestDTO[] = [
      ...agencyData.map(toVendorRequestDTO),
      ...hotelData.map(toVendorRequestDTO),
      ...restaurantData.map(toVendorRequestDTO),
    ];

    const allUserDTO = [...userData.map(toUserProfileDTO)];
    let allUsers = [...allUserDTO, ...vendorDTO];

    if (search && search.trim() !== '') {
      const query = search.toLowerCase();
      allUsers = allUsers.filter(
        (user) =>
          (user as userProfileDTO).name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          (user as vendorRequestDTO).companyName?.toLowerCase().includes(query)
      );
    }

    if (role && role !== '') {
      const queryRole = role.toLowerCase();

      allUsers = allUsers.filter((user) => {
        const userRole =
          (user as userProfileDTO).role?.toLowerCase() ||
          (user as vendorRequestDTO).role.toLowerCase()

        return userRole === queryRole;
      });
    }

    if (status && status !== '') {
      if (status === 'Active') {
        allUsers = allUsers.filter(
          (user) =>
            (!('isBlocked' in user) || !user.isBlocked) &&
            (!('isApproved' in user) || user.isApproved)
        );
      } else if (status === 'Blocked') {
        allUsers = allUsers.filter(
          (user) =>
            (('isBlocked' in user) && user.isBlocked) ||
            (('isApproved' in user) && !user.isApproved)
        );
      }
    }


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
