import { foodDTO } from "../../../../core/DTO/restaurant/requestDTO";
import { IFoods } from "../../../../core/interface/modelInterface/IFoods";
import { IBaserepository } from "../IBaseRepositories";

export interface IRestaurantFoodRespository extends IBaserepository<IFoods>{
  findAllFoodsWithPartners(page:number,lim?:number,search?:string):Promise<{ data: foodDTO[], total: number, page: number, totalPages: number }>;
}