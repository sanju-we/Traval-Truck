import { foodType } from "../../../../types/restaurantType.js";
import { foodDTO } from "../../../../core/DTO/restaurant/requestDTO.js";

export interface IRestaurantFoodService{
  getAllData(id:string):Promise<foodDTO[]>
  addFood(data:foodType,files:Express.Multer.File[],id:string):Promise<foodDTO>;
  update(data:foodType,files:Express.Multer.File[]):Promise<foodDTO>;
}