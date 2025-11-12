import { foodDTO } from "../../../../core/DTO/restaurant/requestDTO.js";
import { IFoods } from "../../../../core/interface/modelInterface/IFoods.js";
import { IBaserepository } from "../IBaseRepositories";

export interface IRestaurantFoodRespository extends IBaserepository<IFoods>{
  findAllFoodsWithPartners(page:number,lim?:number):Promise<{ data: foodDTO[], total: number, page: number, totalPages: number }>;
}