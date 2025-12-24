import { IHotelOrderService } from "../../core/interface/serivice/hotel/Ihotel.order.service.js";
import { inject, injectable } from "inversify";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";
import { orderDTO, toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO.js";

@injectable()
export class HotelOrderService implements IHotelOrderService {
  constructor(
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
  ) { }
  async getAllOrders(userId: string): Promise<orderDTO[]> {
    const orders = await this._orderRepo.findAll({ ownedBy: userId }, {})
    return orders.map(toOrderDTO)
  }
}