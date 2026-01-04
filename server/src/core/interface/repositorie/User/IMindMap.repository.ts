import { IBaserepository } from "../IBaseRepositories";
import { IMindMap } from "../../../../core/interface/modelInterface/IMindMap.js";
import { MindMapResDTO } from "../../../../core/DTO/user/Response/mindMap.res";

export interface IMindMapRepository extends IBaserepository<IMindMap>{
  findMapsWithPagination(userId:string,page:number):Promise<MindMapResDTO[] | null>;
}