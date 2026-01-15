import { Replay } from "../../models/Replay";
import { BaseRepository } from "../../repositories/baseRepository";
import { IReplay } from "../../core/interface/modelInterface/IReplay";
import { IReplayRepository } from "../../core/interface/repositorie/shared/Ireplay.repository";

export class ReplayRepository extends BaseRepository<IReplay> implements IReplayRepository{
  constructor(){
    super(Replay)
  }
}
