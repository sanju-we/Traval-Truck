import { PlaceNode } from "@utils/tripPlanner";
import { places } from "../Request/mindMap";
import { IMindMap } from "../../../../core/interface/modelInterface/IMindMap";

export interface routeMetrics {
  totalDistance: number,
  fuelCost: number,
  days: number
}

export interface startingPosition {
  address: string,
  lat: number,
  lng: number
}

export interface timeAllocation{
    drivingHoursAllocatedPerDay: number,
    estimatedActualDrivingTimeInVehicle: string,
    timeForFoodAndActivities: string      
  }

export interface budget{
  fuelAmount:number,
  foodAmount:number,
  totalApproximateBudget:number
}

export interface aiInsights {
  feasibilityStatus: string,
  feasibilityDetails: string,
  dailyTravelDistanceReality: string,
  dailyTravelDistanceDetails: string,
  budgetReliability: string,
  budgetReliabilityDetails: string,
  risks: string[],
  improvements: string[]
}

export interface MindMapResDTO {
  id:string,
  orderId: string,
  title: string,
  places: places[],
  plan: PlaceNode[][],
  partners:number,
  startDate: Date,
  endDate: Date,
  startingPosition: startingPosition,
  budget:budget,
  routeMetrics: routeMetrics,
  status: string,
  isPublic: boolean,
  tripProgress: string[],
  createdAt: Date
}

export const toMindMapRes = (mindMap: IMindMap): MindMapResDTO => ({
  id:mindMap._id.toString(),
  orderId: mindMap.orderId,
  title: mindMap.title,
  places: mindMap.places,
  plan: mindMap.plan,
  partners:mindMap.partners,
  startDate: mindMap.startDate,
  endDate: mindMap.endDate,
  startingPosition: mindMap.startingPosition,
  routeMetrics: mindMap.routeMetrics,
  budget:mindMap.budget,
  status: mindMap.status,
  isPublic: mindMap.isPublic,
  tripProgress: mindMap.tripProgress,
  createdAt: mindMap.createdAt
})