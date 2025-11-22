import { IUserFoodsService } from "../../core/interface/serivice/user/IUser.foods.service.js";
import { IRestaurantFoodRespository } from "../../core/interface/repositorie/restaurant/Irestaurant.food.repository.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { foodDTO } from "../../core/DTO/restaurant/requestDTO.js";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js";

@injectable()
export class userFoodsService implements IUserFoodsService {
  constructor(
    @inject('IRestaurantFoodRespository') private readonly _foodRepository: IRestaurantFoodRespository,
    @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo : ISubscriptionHistoryRepository
  ) { }
  async getAllRooms(page: number, limit: number, search?: string): Promise<{ data: foodDTO[]; total: number; page: number; totalPages: number; }> {
    const data = await this._foodRepository.findAllFoodsWithPartners(page, limit, search)
    const checks = await Promise.all(
      data.data.map(async (food) => {
        const subscription = await this._subscriptionHistoryRepo.findOne({
          userId: food.restaurant,
        })
        return subscription ? food : null
      })
    )
    const result = checks.filter((food) => food !== null) as foodDTO[]
    data.data = result
    if (data) return data
    throw new DataNotFoundError()
  }
}