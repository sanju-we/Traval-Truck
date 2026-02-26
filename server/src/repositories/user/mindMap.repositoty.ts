import { IMindMapRepository } from "../../core/interface/repositorie/User/IMindMap.repository";
import { BaseRepository } from "../../repositories/baseRepository";
import { IMindMap } from "../../core/interface/modelInterface/IMindMap";
import { MindMap } from "../../models/MindMap";
import { MindMapResDTO, toMindMapRes } from "../../core/DTO/user/Response/mindMap.res";

export class MindMapRepository extends BaseRepository<IMindMap> implements IMindMapRepository {
  constructor() {
    super(MindMap);
  }

  async findMapsWithPagination(userId: string, page: number, limit: number): Promise<{ data: MindMapResDTO[], total: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter = { userId: userId };
    const maps = await MindMap.find(filter).skip(skip).limit(limit);
    const total = await MindMap.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    return {
      data: maps.map(toMindMapRes),
      total,
      totalPages
    };
  }
}