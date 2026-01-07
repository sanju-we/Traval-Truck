import { Document,Schema,Types } from "mongoose";
import { places } from "../../../core/DTO/user/Request/mindMap";
import { PlaceNode } from "../../../utils/tripPlanner";
import { aiInsights, budget, routeMetrics, startingPosition, timeAllocation } from "../../../core/DTO/user/Response/mindMap.res";

export interface IMindMap extends Document{
  _id:Types.ObjectId;
  orderId:string;
  title:string;
  startDate:Date;
  endDate:Date;
  timeAllocation:timeAllocation,
  places:places[];
  startingPosition:startingPosition;
  partners:number;
  budget:budget;
  userId:string;
  status:string;
  routeMetrics:routeMetrics;
  aiInsights:aiInsights;
  plan:PlaceNode[][];
  tripProgress:string[];
  isPublic:boolean;
  createdAt:Date;
  updatedAt:Date;
}