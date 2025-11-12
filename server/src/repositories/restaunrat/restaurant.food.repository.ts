import { IRestaurantFoodRespository } from "../../core/interface/repositorie/restaurant/Irestaurant.food.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import Foods from "../../models/Foods.js";
import { IFoods } from "../../core/interface/modelInterface/IFoods";
import { foodDTO, toFoodDTO } from "../../core/DTO/restaurant/requestDTO.js";
import { Data_Creation_Error } from "../../utils/resAndErrors.js";

export class RestaurantFoodRepository extends BaseRepository<IFoods> implements IRestaurantFoodRespository{
  constructor(){
    super(Foods)
  }

  async findAllFoodsWithPartners(page: number, lim?: number): Promise<{ data: foodDTO[]; total: number; page: number; totalPages: number; }> {
      const limit = lim || 6;
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      // .populate('RestaurantId')
      Foods.find()
        .skip(skip)
        .limit(limit)
        .lean(),
      Foods.countDocuments()
    ]);

    if (!packages.length) throw new Data_Creation_Error();

    return {
      data: packages.map(toFoodDTO),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}