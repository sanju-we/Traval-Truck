import { Document,Schema,Types } from "mongoose";
import { places } from "../../../core/DTO/user/Request/mindMap";
import { PlaceNode } from "../../../utils/tripPlanner";

export interface IMindMap extends Document{
  _id:Types.ObjectId;
  title:string;
  startDate:Date;
  endDate:Date;
  places:places[];
  startingPosition:string[];
  partners:number;
  budget:number;
  userId:string;
  orderId:string;
  status:string;
  plan:PlaceNode[][];
  tripProgress:string[];
  isPublic:boolean;
  createdAt:Date;
  updatedAt:Date;
}