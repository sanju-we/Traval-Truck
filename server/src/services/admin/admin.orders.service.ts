import { IAdminOrderService } from "../../core/interface/serivice/admin/Iadmin.orders.service.js";
import { inject, injectable } from "inversify";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { TripDTO } from "../../core/DTO/user/Response/user.trip.DTO.js";

injectable()
export class AdminOrderService implements IAdminOrderService {
  constructor(
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
  ) { }
  async getAllOrders(): Promise<TripDTO[]> {
    const Orders = await this._orderRepo.findAllOrdersAdmin()
    if (!Orders) throw new DataNotFoundError();
    return Orders
  }
}