import { IAgencyOrderService } from "../../core/interface/serivice/agency/Iagency.orders.service.js";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";
import { inject, injectable } from "inversify";
import { logger } from "../../utils/logger.js";
import { orderDTO, toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO.js";
import { DataNotFoundError, DataUpdatingError } from "../../utils/resAndErrors.js";

@injectable()
export class AgencyOrderService implements IAgencyOrderService {
  constructor(
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository
  ) { }

  async getAllOrder(userId: string): Promise<orderDTO[]> {
    const orders = await this._orderRepo.findAll({ ownedBy: userId }, {})
    logger.info(`saj${orders}`)
    return orders.map(toOrderDTO)
  }

  async setStartDate(orderId: string, date: string): Promise<orderDTO> {
    const order = await this._orderRepo.findById(orderId);
    if (!order) throw new DataNotFoundError()
    const updated = await this._orderRepo.update(order.id, { startDate: date })
    if (!updated) throw new DataUpdatingError()
    return toOrderDTO(updated)
  }

  async getOrder(orderId: string): Promise<orderDTO> {
    const order = await this._orderRepo.findById(orderId);
    if (!order) throw new DataNotFoundError()
    return toOrderDTO(order)
  }
}