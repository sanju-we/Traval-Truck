export interface IFoodValidator{
  FoodValidator(name:string, description:string, price:number, availableQ:number, category:string):Promise<void>;
}