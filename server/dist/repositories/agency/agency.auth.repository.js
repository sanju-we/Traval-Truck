"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agencyRepository = void 0;
const Agency_1 = require("../../models/Agency");
const baseRepository_1 = require("../../repositories/baseRepository");
class agencyRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Agency_1.Agency);
    }
    async updateAgencyPasswordById(id, hashedPassword) {
        await Agency_1.Agency.findByIdAndUpdate(id, { password: hashedPassword });
        return;
    }
    async findByIdAndUpdateAction(id, action, field, reason) {
        if (reason != '') {
            await Agency_1.Agency.findByIdAndUpdate(id, { reason: reason });
        }
        await Agency_1.Agency.findByIdAndUpdate(id, { [field]: action });
    }
}
exports.agencyRepository = agencyRepository;
