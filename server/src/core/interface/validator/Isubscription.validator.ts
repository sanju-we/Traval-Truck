
export interface ISubscriptionValidator{
  addSubscriptionValidator(Name:string,Amount:number,Category:string,Description:string,Duration:{startingDate:string,endingDate:string},Features:string[],Valid:number) : Promise<void>;
  updateStatusValidator(id:string,action:string,role:string):Promise<void>;
  reasonValidation(reason:string):Promise<void>;
  updateBlockValidator(id:string,role:string): Promise<void>;
}