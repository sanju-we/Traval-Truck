import { IPackage } from "../../../interface/modelInterface/Ipackage.js";


interface ItineraryDTO {
  activities: string[];
  day: number;
  title: string;
}

export interface PackageResDTO {
  id:string;
  availableFoods: string[];
  description: string;
  discoveries: string[];
  duration: string;
  itinerary: ItineraryDTO[];
  price: number;
  title: string;
  images:string[];
  ownedBy:string
}

export const toPackageResDTO = (pkg: IPackage): PackageResDTO => ({
  id:pkg._id.toString(),
  availableFoods: pkg.availableFoods || [],
  description: pkg.description || "",
  discoveries: pkg.discoveries || [],
  duration: pkg.duration || "",
  itinerary: pkg.itinerary || [],
  price: pkg.price || 0,
  title: pkg.title || "",
  images:pkg.images || [],
  ownedBy:pkg.ownedBy
});