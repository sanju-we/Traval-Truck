"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MindMapRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const MindMap_1 = require("../../models/MindMap");
const mindMap_res_1 = require("../../core/DTO/user/Response/mindMap.res");
class MindMapRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(MindMap_1.MindMap);
    }
    async findMapsWithPagination(userId, page) {
        const maps = await MindMap_1.MindMap.find({ userId: userId }).skip(page - 1).limit(5);
        return maps.map(mindMap_res_1.toMindMapRes);
    }
}
exports.MindMapRepository = MindMapRepository;
