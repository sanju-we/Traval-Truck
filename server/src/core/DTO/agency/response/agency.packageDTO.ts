import { IPackage } from "../../../interface/modelInterface/Ipackage.js";

interface PartnerDTO {
  _id: string;
  PartnerName: string;
  PartnerType: string;
  Location: string;
  Email: string;
  Phone: number;
  Status: string;
  Media: {
    Logo: string;
    Gallery: string[];
  };
}

interface ItineraryDTO {
  Activities: string[];
  Day: number;
  Title: string;
}

export interface PackageResDTO {
  id:string;
  availableFoods: string[];
  description: string;
  dining: (string | PartnerDTO)[];
  discoveries: string[];
  duration: string;
  hotels: (string | PartnerDTO)[];
  itinerary: ItineraryDTO[];
  price: number;
  title: string;
}

export const toPackageResDTO = (pkg: IPackage): PackageResDTO => ({
  id:pkg._id.toString(),
  availableFoods: pkg.availableFoods || [],
  description: pkg.description || "",
  dining: pkg.dining || [],        
  discoveries: pkg.discoveries || [],
  duration: pkg.duration || "",
  hotels: pkg.hotels || [],        
  itinerary: pkg.itinerary || [],
  price: pkg.price || 0,
  title: pkg.title || "",
});