import { IPackage } from "../../../interface/modelInterface/Ipackage.js";

interface irineray{
  Activities:string[],
  Day:number,
  Title:string
}
export interface PackageDTO{
  availableFoods : string[],
  description:string,
  dining:string[],
  discoveries:string[],
  duration:string,
  hotels:string[],
  itinerary:irineray[],
  price:number,
  title:string
}

export const toPackageDTO = (packages:IPackage) =>({
  availableFoods:packages.availableFoods,
  description:packages.description,
  dining:packages.dining,
  discoveries:packages.discoveries,
  duration:packages.duration,
  hotels:packages.hotels,
  itinerary:packages.itinerary,
  price:packages.price,
  title:packages.title
})