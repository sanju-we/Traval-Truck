import { BaseRepository } from "../../repositories/baseRepository";
import { MindMap } from "../../models/MindMap";
import { toMindMapRes } from "../../core/DTO/user/Response/mindMap.res";
export class MindMapRepository extends BaseRepository {
    constructor() {
        super(MindMap);
    }
    async findMapsWithPagination(userId, page) {
        const maps = await MindMap.find({ userId: userId }).skip(page - 1).limit(5);
        return maps.map(toMindMapRes);
    }
}
