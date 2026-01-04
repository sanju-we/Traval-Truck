import { PlaceNode } from "@utils/tripPlanner";
import { places } from "../Request/mindMap";
import { IMindMap } from "../../../../core/interface/modelInterface/IMindMap";

export interface MindMapResDTO{
  orderId:string,
  places:places[],
  plan:PlaceNode[][],
  startDate:Date,
  endDate:Date,
  startingPosition:string[],
  status:string,
  isPublic:boolean,
  tripProgress:string[],
  createdAt:Date
}

export const toMindMapRes = (mindMap:IMindMap):MindMapResDTO => ({
  orderId:mindMap.orderId,
  places:mindMap.places,
  plan:mindMap.plan,
  startDate:mindMap.startDate,
  endDate:mindMap.endDate,
  startingPosition:mindMap.startingPosition,
  status:mindMap.status,
  isPublic:mindMap.isPublic,
  tripProgress:mindMap.tripProgress,
  createdAt:mindMap.createdAt
})