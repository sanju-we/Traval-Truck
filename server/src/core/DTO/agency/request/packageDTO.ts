import { IPackage } from "../../../interface/modelInterface/Ipackage";

interface irineray{
  activities:string[],
  day:number,
  title:string
}
export interface PackageDTO{
  availableFoods : string[],
  description:string,
  discoveries:string[],
  duration:string,
  images:string[],
  itinerary:irineray[],
  price:number,
  maxPeople:number,
  title:string
}

export const toPackageDTO = (packages:IPackage):PackageDTO =>({
  availableFoods:packages.availableFoods,
  description:packages.description,
  discoveries:packages.discoveries,
  duration:packages.duration,
  itinerary:packages.itinerary,
  price:packages.price,
  maxPeople:packages.maxPeople,
  title:packages.title,
  images:packages.images
})