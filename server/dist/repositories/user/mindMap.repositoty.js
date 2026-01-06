import { BaseRepository } from "../../repositories/baseRepository.js";
import { MindMap } from "../../models/MindMap.js";
import { toMindMapRes } from "../../core/DTO/user/Response/mindMap.res.js";
export class MindMapRepository extends BaseRepository {
    constructor() {
        super(MindMap);
    }
    async findMapsWithPagination(userId, page) {
        const maps = await MindMap.find({ userId: userId }).skip(page - 1).limit(5);
        return maps.map(toMindMapRes);
    }
}
