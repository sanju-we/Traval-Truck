import { IUserTripService } from "../../core/interface/serivice/user/IUser.trips.service.js";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { TripDTO } from "../../core/DTO/user/Response/user.trip.DTO.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class UserTripService implements IUserTripService {
  constructor(
    @inject('IOrdersRepository') private readonly _ordersRepo: IOrdersRepository
  ) { }

  async history(userId: string): Promise<TripDTO[]> {
    const history = await this._ordersRepo.findAllByProduct(userId)
    logger.info(`charle ${history}`)
    if (!history) throw new DataNotFoundError()
    return history
  }
}