import { MindMapResDTO } from "../../../../core/DTO/user/Response/mindMap.res.js";
import { MindMapRequest } from "../../../../core/DTO/user/Request/mindMap.js";

export interface IUserMindMapService{
  createMap(data:MindMapRequest,userId:string):Promise<MindMapResDTO>;
  getMaps(page:number,userId:string):Promise<{data:MindMapResDTO[],page:number}>;
}