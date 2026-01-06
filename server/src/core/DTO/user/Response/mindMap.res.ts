import { PlaceNode } from "@utils/tripPlanner";
import { places } from "../Request/mindMap";
import { IMindMap } from "../../../../core/interface/modelInterface/IMindMap";

export interface routeMetrics{
  totalDistance:number,
  fuelCost:number,
  days:number
}

export interface startingPosition{
  address:string,
  lat:number,
  lng:number
}

export interface aiInsights{
  feasibility:string[],
  realism:string[],
  budgetReliability:string[],
  risks:string[],
  improvements:string[],
  breakdown:string[]
}

export interface MindMapResDTO{
  orderId:string,
  title:string,
  places:places[],
  plan:PlaceNode[][],
  startDate:Date,
  endDate:Date,
  startingPosition:startingPosition,
  routeMetrics:routeMetrics,
  status:string,
  isPublic:boolean,
  tripProgress:string[],
  createdAt:Date
}

export const toMindMapRes = (mindMap:IMindMap):MindMapResDTO => ({
  orderId:mindMap.orderId,
  title:mindMap.title,
  places:mindMap.places,
  plan:mindMap.plan,
  startDate:mindMap.startDate,
  endDate:mindMap.endDate,
  startingPosition:mindMap.startingPosition,
  routeMetrics:mindMap.routeMetrics,
  status:mindMap.status,
  isPublic:mindMap.isPublic,
  tripProgress:mindMap.tripProgress,
  createdAt:mindMap.createdAt
})