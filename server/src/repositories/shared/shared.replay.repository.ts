import { Replay } from "../../models/Replay.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { IReplay } from "../../core/interface/modelInterface/IReplay.js";
import { IReplayRepository } from "../../core/interface/repositorie/shared/Ireplay.repository.js";

export class ReplayRepository extends BaseRepository<IReplay> implements IReplayRepository{
  constructor(){
    super(Replay)
  }
}
