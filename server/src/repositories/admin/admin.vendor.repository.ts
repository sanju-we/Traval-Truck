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
import { User } from '../../models/SUser';
import { Agency } from '../../models/Agency';
import { Hotel } from '../../models/Hotel';
import { Restaurant } from '../../models/Restaurant';

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

  async findAllUsers(page: number, limit: number, status: string, role: string, search: string): Promise<{ data: (vendorRequestDTO | userProfileDTO)[]; total: number; page: number; totalPages: number; }> {
    const userFilter: Record<string, unknown> = { role: { $ne: 'admin' } };
    const agencyFilter: Record<string, unknown> = { isApproved: true };
    const hotelFilter: Record<string, unknown> = { isApproved: true };
    const restaurantFilter: Record<string, unknown> = { isApproved: true };

    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search, $options: 'i' };
      userFilter.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
      agencyFilter.$or = [
        { companyName: searchRegex },
        { email: searchRegex },
        { ownerName: searchRegex }
      ];
      hotelFilter.$or = [
        { companyName: searchRegex },
        { email: searchRegex },
        { ownerName: searchRegex }
      ];
      restaurantFilter.$or = [
        { companyName: searchRegex },
        { email: searchRegex },
        { ownerName: searchRegex }
      ];
    }

    if (status && status !== '') {
      if (status === 'Active') {
        userFilter.isBlocked = false;
        agencyFilter.isRestricted = false;
        hotelFilter.isRestricted = false;
        restaurantFilter.isRestricted = false;
      } else if (status === 'Blocked') {
        userFilter.isBlocked = true;
        agencyFilter.isRestricted = true;
        hotelFilter.isRestricted = true;
        restaurantFilter.isRestricted = true;
      }
    }

    let countUser = 0;
    let countAgency = 0;
    let countHotel = 0;
    let countRestaurant = 0;

    const lowerRole = role ? role.toLowerCase() : '';

    if (lowerRole === '') {
      [countUser, countAgency, countHotel, countRestaurant] = await Promise.all([
        User.countDocuments(userFilter),
        Agency.countDocuments(agencyFilter),
        Hotel.countDocuments(hotelFilter),
        Restaurant.countDocuments(restaurantFilter),
      ]);
    } else {
      if (lowerRole === 'user') {
        countUser = await User.countDocuments(userFilter);
      } else if (lowerRole === 'agency') {
        countAgency = await Agency.countDocuments(agencyFilter);
      } else if (lowerRole === 'hotel') {
        countHotel = await Hotel.countDocuments(hotelFilter);
      } else if (lowerRole === 'restaurant') {
        countRestaurant = await Restaurant.countDocuments(restaurantFilter);
      }
    }

    const total = countUser + countAgency + countHotel + countRestaurant;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const results: (vendorRequestDTO | userProfileDTO)[] = [];
    let remainingSkip = skip;
    let remainingLimit = limit;

    const collections = [
      { name: 'user', count: countUser, model: User, filter: userFilter, map: toUserProfileDTO },
      { name: 'agency', count: countAgency, model: Agency, filter: agencyFilter, map: toVendorRequestDTO },
      { name: 'hotel', count: countHotel, model: Hotel, filter: hotelFilter, map: toVendorRequestDTO },
      { name: 'restaurant', count: countRestaurant, model: Restaurant, filter: restaurantFilter, map: toVendorRequestDTO },
    ];

    for (const col of collections) {
      if (remainingLimit <= 0) break;
      if (col.count === 0) continue;

      if (remainingSkip >= col.count) {
        remainingSkip -= col.count;
        continue;
      }

      const fetchSkip = remainingSkip;
      const fetchLimit = Math.min(remainingLimit, col.count - fetchSkip);

      type MongooseModel = {
        find: (filter: Record<string, unknown>) => {
          skip: (n: number) => {
            limit: (l: number) => {
              lean: () => {
                exec: () => Promise<Record<string, unknown>[]>;
              };
            };
          };
        };
      };

      const docs = await (col.model as unknown as MongooseModel).find(col.filter)
        .skip(fetchSkip)
        .limit(fetchLimit)
        .lean()
        .exec();

      const mapped = docs.map((doc) => {
        if (col.name !== 'user' && !doc.role) {
          doc.role = col.name;
        }
        const dto = col.map(doc as never);
        if ('isApproved' in dto) {
          (dto as unknown as { isBlocked: boolean; isApproved: boolean; isRestricted: boolean }).isBlocked = !dto.isApproved || dto.isRestricted;
        }
        return dto;
      });

      results.push(...mapped);

      remainingSkip = 0;
      remainingLimit -= fetchLimit;
    }

    return {
      data: results,
      total,
      page,
      totalPages,
    };
  }
}
