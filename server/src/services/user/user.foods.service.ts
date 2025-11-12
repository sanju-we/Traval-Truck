import { IUserFoodsService } from "../../core/interface/serivice/user/IUser.foods.service.js";
import { IRestaurantFoodRespository } from "../../core/interface/repositorie/restaurant/Irestaurant.food.repository.js";
import { inject,injectable } from "inversify"; 
import { DataNotFoundError } from "../../utils/resAndErrors.js";
import { foodDTO } from "../../core/DTO/restaurant/requestDTO.js";

@injectable()
export class userFoodsService implements IUserFoodsService{
  constructor(
    @inject('IRestaurantFoodRespository') private readonly _foodRepository : IRestaurantFoodRespository
  ){}
  async getAllRooms(page: number, limit: number): Promise<{ data: foodDTO[]; total: number; page: number; totalPages: number; }> {
      const data = await this._foodRepository.findAllFoodsWithPartners(page,limit)
      if(data) return data
      throw new DataNotFoundError()
  }
}