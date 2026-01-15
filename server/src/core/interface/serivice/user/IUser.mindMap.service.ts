import { MindMapResDTO } from "../../../../core/DTO/user/Response/mindMap.res";
import { MindMapRequest } from "../../../../core/DTO/user/Request/mindMap";

export interface IUserMindMapService{
  createMap(data:MindMapRequest,userId:string):Promise<MindMapResDTO>;
  getMaps(page:number,userId:string):Promise<{data:MindMapResDTO[],page:number}>;
  getMap(mapId:string):Promise<MindMapResDTO>;
  confirmMap(mapId:string):Promise<MindMapResDTO>
}