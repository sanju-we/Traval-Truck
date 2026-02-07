"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toReplayDTO = void 0;
const toReplayDTO = (replay) => ({
    comment: replay.comment,
    reviewId: replay.reviewId,
    id: replay._id.toString(),
    replayer: replay.replayer
});
exports.toReplayDTO = toReplayDTO;
