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
    async findMapsWithPagination(userId, page, limit) {
        const skip = (page - 1) * limit;
        const filter = { userId: userId };
        const maps = await MindMap_1.MindMap.find(filter).skip(skip).limit(limit);
        const total = await MindMap_1.MindMap.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        return {
            data: maps.map(mindMap_res_1.toMindMapRes),
            total,
            totalPages
        };
    }
}
exports.MindMapRepository = MindMapRepository;
