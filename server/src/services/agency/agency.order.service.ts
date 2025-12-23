import { IAgencyOrderService } from "../../core/interface/serivice/agency/Iagency.orders.service.js";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";
import { inject, injectable } from "inversify";
import { logger } from "../../utils/logger.js";
import { orderDTO, toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO.js";
import { DataNotFoundError, DataUpdatingError, START_DATE_ERROR, TRIP_ALREADY_STARTED } from "../../utils/resAndErrors.js";
import { IGenerateTrip } from "../../core/interface/utils/Igenerate.trip.js";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator.js";

@injectable()
export class AgencyOrderService implements IAgencyOrderService {
  constructor(
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
    @inject('IGenerateTrip') private readonly _tripGenerator: IGenerateTrip,
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator
  ) { }

  async getAllOrder(userId: string): Promise<orderDTO[]> {
    const orders = await this._orderRepo.findAll({ ownedBy: userId }, {})
    logger.info(`saj${orders}`)
    return orders.map(toOrderDTO)
  }

  async setStartDate(orderId: string, date: string): Promise<orderDTO> {
    const order = await this._orderRepo.findOrderWithProduct(orderId);
    if (!order) throw new DataNotFoundError()
    const plan = await this._tripGenerator.generatePlanFromItinerary((order.product as any).itinerary, new Date(date))
    const updated = await this._orderRepo.update(order.id, { startDate: date, plan: plan, endDate: plan[plan.length - 1].date })
    if (!updated) throw new DataUpdatingError()
    return toOrderDTO(updated)
  }

  async getOrder(orderId: string): Promise<orderDTO> {
    const order = await this._orderRepo.findOrderWithProduct(orderId);
    logger.info(`sunnnnnyyyyyy:${order}`)
    if (!order) throw new DataNotFoundError()
    return toOrderDTO(order)
  }

  async startTrip(orderId: string): Promise<orderDTO> {
    await this._baseValidator.idValidator(orderId)
    const order = await this._orderRepo.findById(orderId);
    if (!order) throw new DataNotFoundError()
    if (!order.startDate) throw new START_DATE_ERROR()
    if (order.status !== 'Upcoming') throw new TRIP_ALREADY_STARTED()

    order.status = 'Ongoing'
    order.tripProgress = {
      currentDay: 1,
      completedDays: [],
      startedAt: new Date()
    }

    const updated = await this._orderRepo.update(order._id.toString(), order)
    if(!updated) throw new DataUpdatingError()
    return toOrderDTO(updated)
  }
}