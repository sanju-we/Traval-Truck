import { MindMapResDTO } from "../../../../core/DTO/user/Response/mindMap.res.js";
import { MindMapRequest } from "../../../../core/DTO/user/Request/mindMap.js";

export interface IUserMindMapService{
  createMap(data:MindMapRequest,userId:string):Promise<MindMapResDTO>;
}