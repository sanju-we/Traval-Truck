import { IMindMapRepository } from "../../core/interface/repositorie/User/IMindMap.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { IMindMap } from "../../core/interface/modelInterface/IMindMap";
import { MindMap } from "../../models/MindMap.js";

export class MindMapRepository extends BaseRepository<IMindMap> implements IMindMapRepository{
  constructor(){
    super(MindMap);
  }
}