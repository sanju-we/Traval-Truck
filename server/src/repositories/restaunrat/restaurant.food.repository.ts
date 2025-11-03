import { IRestaurantFoodRespository } from "../../core/interface/repositorie/restaurant/Irestaurant.food.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import Foods from "../../models/Foods.js";
import { IFoods } from "@core/interface/modelInterface/IFoods";

export class RestaurantFoodRepository extends BaseRepository<IFoods> implements IRestaurantFoodRespository{
  constructor(){
    super(Foods)
  }
}