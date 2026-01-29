import { Replay } from "../../models/Replay";
import { BaseRepository } from "../../repositories/baseRepository";
export class ReplayRepository extends BaseRepository {
    constructor() {
        super(Replay);
    }
}
