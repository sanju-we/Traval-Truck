import { IAdminOrderService } from "../../core/interface/serivice/admin/Iadmin.orders.service";
import { inject, injectable } from "inversify";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";
import { DataNotFoundError } from "../../utils/resAndErrors";
import { TripDTO } from "../../core/DTO/user/Response/user.trip.DTO";
import { IUserMapper } from "../../core/interface/mapper/IUserMapper";

injectable()
export class AdminOrderService implements IAdminOrderService {
  constructor(
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
    @inject('IUserMapper') private readonly _userMapper: IUserMapper,
  ) { }
  async getAllOrders(): Promise<TripDTO[]> {
    const Orders = await this._orderRepo.findAllOrdersAdmin()
    if (!Orders) throw new DataNotFoundError();
    return await Promise.all(
      Orders.map(order => this._userMapper.toTripDTO(order))
    );
  }
}