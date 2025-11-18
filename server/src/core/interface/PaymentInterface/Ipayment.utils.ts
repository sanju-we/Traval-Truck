
export interface IPaymentUtils{
  createPaymentIntent(amount:number,currency:string):Promise<string[]>;
  verifyPaymentIntent(paymentIntentId:string,expenctedAmount:number):Promise<{valid:boolean,message:string}>
}