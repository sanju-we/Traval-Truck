"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayRepository = void 0;
const Replay_1 = require("../../models/Replay");
const baseRepository_1 = require("../../repositories/baseRepository");
class ReplayRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Replay_1.Replay);
    }
}
exports.ReplayRepository = ReplayRepository;
