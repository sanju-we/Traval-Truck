import { IFoods } from "../../../core/interface/modelInterface/IFoods"

export interface foodDTO{
  id:string,
  name:string,
  description:string,
  price:number,
  availableQuantity:number,
  category:string,
  images:string[],
  status:string
  restaurant:string
}

export const toFoodDTO = (food:IFoods):foodDTO => ({
  id:food._id.toString(),
  name:food.Name,
  description:food.Description,
  price:food.Price,
  availableQuantity:food.AvailableQuantity,
  category:food.Category,
  images:food.Image,
  status:food.Status,
  restaurant:food.Restaurant
})