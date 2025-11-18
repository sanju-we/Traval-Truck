
export interface IPaymentValidator{
  addMoneyValidator(paymentIntentId:string,amount:number):Promise<void>;
}