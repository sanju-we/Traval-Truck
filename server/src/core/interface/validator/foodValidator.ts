export interface IFoodValidator{
  FoodValidator(name:string, description:string, price:number, availableQ:number, category:string, status:string):Promise<void>;
}