
export interface IUserPaymentService{
  createPaymentIntent(amount:number,currency:string):Promise<string>;
}