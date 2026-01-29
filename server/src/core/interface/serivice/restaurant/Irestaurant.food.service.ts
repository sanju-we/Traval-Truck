import { foodType } from "../../../../types/restaurantType";
import { foodDTO } from "../../../../core/DTO/restaurant/requestDTO";

export interface IRestaurantFoodService{
  getAllData(id:string):Promise<foodDTO[]>
  addFood(data:foodType,files:Express.Multer.File[],id:string):Promise<foodDTO>;
  update(data:foodType,files:Express.Multer.File[]):Promise<foodDTO>;
  delete(productId:string,index:number):Promise<foodDTO>;
}