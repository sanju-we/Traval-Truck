"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Replay = void 0;
const mongoose_1 = require("mongoose");
const replaySchema = new mongoose_1.Schema({
    comment: { type: String },
    replayer: { type: String },
    replayerId: { type: String, refPath: 'replayer' },
    productId: { type: String },
    reviewId: { type: String, ref: 'Review' }
});
exports.Replay = (0, mongoose_1.model)('Replay', replaySchema);
