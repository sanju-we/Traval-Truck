import { IMindMapRepository } from "../../core/interface/repositorie/User/IMindMap.repository";
import { BaseRepository } from "../../repositories/baseRepository";
import { IMindMap } from "../../core/interface/modelInterface/IMindMap";
import { MindMap } from "../../models/MindMap";
import { MindMapResDTO, toMindMapRes } from "../../core/DTO/user/Response/mindMap.res";

export class MindMapRepository extends BaseRepository<IMindMap> implements IMindMapRepository{
  constructor(){
    super(MindMap);
  }

  async findMapsWithPagination(userId: string, page: number): Promise<MindMapResDTO[] | null> {
    const maps = await MindMap.find({userId:userId}).skip(page-1).limit(5)
    return maps.map(toMindMapRes)
  }
}