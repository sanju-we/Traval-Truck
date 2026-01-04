
export interface places{
  id:number,
  name:string,
  address:string,
  lat:number,
  lng:number
}

export interface MindMapRequest{
  startingPostition:string[],
  startDate:Date,
  endDate:Date,
  startPlace:string,
  title:string,
  places:places[]
}