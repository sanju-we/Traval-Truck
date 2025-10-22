export interface subscriptionData{
  id:string,
  name:string,
  category:string,
  duration:{
    startingDate:Date,
    endingDate:Date
  },
  valid:number,
  description:string,
  amount:number,
  features:string[],
  isActive:boolean,
}