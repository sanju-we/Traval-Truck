import { IAgencyOrderService } from "../../core/interface/serivice/agency/Iagency.orders.service.js";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";
import { inject, injectable } from "inversify";
import { logger } from "../../utils/logger.js";
import { orderDTO, toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO.js";
import { DataNotFoundError, DataUpdatingError, INVALID_STATUS_UPDATION, START_DATE_ERROR, TRIP_ALREADY_STARTED, TRIP_UPDATION_ERROR } from "../../utils/resAndErrors.js";
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
    if (!updated) throw new DataUpdatingError()
    return toOrderDTO(updated)
  }

  async completeActivity(orderId: string, day: number, activityIndex: number): Promise<orderDTO> {
    await this._baseValidator.idValidator(orderId);
    const order = await this._orderRepo.findOrderWithProduct(orderId);
    if (!order || order.status !== "Ongoing" || !order.plan) throw new DataNotFoundError();
    const planDay = order.plan.find((p) => p.day == day)
    if (!planDay) throw new TRIP_UPDATION_ERROR()

    planDay.completedActivities ??= [];
    if (!planDay.completedActivities.includes(activityIndex)) {
      planDay.completedActivities.push(activityIndex)
    }

    order.plan.find(p => {
      if(p.day == day) {
        p = planDay
      }
    })

    await this._orderRepo.update(order._id.toString(), { plan: order.plan,tripProgress: order.tripProgress })
    return toOrderDTO(order)
  }

  async completeDay(orderId: string, day: number): Promise<orderDTO> {
    await this._baseValidator.idValidator(orderId);
    const order = await this._orderRepo.findOrderWithProduct(orderId);
    if(!order || order.status !== "Ongoing" || !order.plan ||!order.tripProgress ) throw new DataNotFoundError();

    const planDay = order.plan.find(p => p.day == day);
    if(!planDay) throw new TRIP_UPDATION_ERROR();

    if(planDay.completedActivities.length != planDay.activities.length) throw new TRIP_UPDATION_ERROR();

    planDay.isCompleted = true;
    order.tripProgress.completedDays.push(day)

    const nextDay = order.plan.find(p => !p.isCompleted)
    order.tripProgress.currentDay = nextDay ? nextDay.day : day

    await this._orderRepo.update(order._id.toString(),{ plan: order.plan,tripProgress: order.tripProgress })
    return toOrderDTO(order)
  }

  async completeTrip(orderId: string): Promise<orderDTO> {
    await this._baseValidator.idValidator(orderId);

    const order = await this._orderRepo.findOrderWithProduct(orderId);
    if(!order || !order.plan || !order.tripProgress || order.status != 'Ongoing') throw new DataNotFoundError();

    const allCompleted = order.plan.every(p => p.isCompleted)
    if(!allCompleted) throw new INVALID_STATUS_UPDATION();

    order.status = 'Completed'
    order.tripProgress.completedAt = new Date()

    await this._orderRepo.update(order._id.toString(),{status : order.status,tripProgress:order.tripProgress})
    return toOrderDTO(order)
  }
}