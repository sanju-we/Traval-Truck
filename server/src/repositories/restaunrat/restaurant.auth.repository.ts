import { IRestaurant } from '../../core/interface/modelInterface/IRestaurant.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { Restaurant } from '../../models/Restaurant.js';
import { vendorData, allRequest } from 'types';
import {
  toVendorRequestDTO,
  vendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

export class RestaurantAuthRepository implements IRestaurantAuthRepository {
  async findByEmail(email: string): Promise<IRestaurant | null> {
    return await Restaurant.findOne({ email: email });
  }

  async findById(id: string): Promise<IRestaurant | null> {
    return await Restaurant.findById(id);
  }

  async createRestauratn(
    data: vendorData & { isApproved: boolean; role: string },
  ): Promise<IRestaurant> {
    return await Restaurant.create(data);
  }

  async findByIdAndUpdatePassword(id: string, hashedPassword: string): Promise<void> {
    await Restaurant.findByIdAndUpdate(id, { password: hashedPassword });
  }

  async findAllRequest(): Promise<vendorRequestDTO[]> {
    const allReq = await Restaurant.find({ isApproved: false });
    return allReq.map(toVendorRequestDTO);
  }

  async findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void> {
    await Restaurant.findByIdAndUpdate(id, { [field]: action });
  }

  async findAll(): Promise<vendorRequestDTO[]> {
    const users = await Restaurant.find({ isApproved: true });
    return users.map(toVendorRequestDTO);
  }

  async findByStatus(status: boolean): Promise<vendorRequestDTO[]> {
    const res = await Restaurant.find({ isApproved:status }); // Or isBlocked: false/true depending on your model
    return res.map(toVendorRequestDTO);
  }
}
