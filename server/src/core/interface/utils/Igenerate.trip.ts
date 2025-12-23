import { TripPlan } from "../../../types/index.js";
import { IPackage } from "../modelInterface/Ipackage";

export interface IGenerateTrip {
  generatePlanFromItinerary (itineray: IPackage['itinerary'],date:Date): Promise<TripPlan[]>;
}