
export interface places{
  id:number,
  name:string,
  address:string,
  lat:number,
  lng:number
}

export interface MindMapRequest{
  id?:string,
  startingPostition:string[],
  startDate:Date,
  endDate:Date,
  startPlace:string,
  title:string,
  vehicle:string,
  milage:string,
  member:string,
  hotelTyep:string,
  food:string,
  foodAmount:string,
  places:places[]
}