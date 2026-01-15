import { Replay } from "../../models/Replay.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
export class ReplayRepository extends BaseRepository {
    constructor() {
        super(Replay);
    }
}
