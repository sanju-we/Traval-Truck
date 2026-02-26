import { IBaserepository } from "../IBaseRepositories";
import { IMindMap } from "../../../../core/interface/modelInterface/IMindMap";
import { MindMapResDTO } from "../../../../core/DTO/user/Response/mindMap.res";

export interface IMindMapRepository extends IBaserepository<IMindMap> {
  findMapsWithPagination(userId: string, page: number, limit: number): Promise<{ data: MindMapResDTO[], total: number, totalPages: number }>;
}