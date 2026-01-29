"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toReviewDTO = exports.toReviewWithReplayDTO = void 0;
const toReviewWithReplayDTO = (review, replays) => ({
    userId: review.userId,
    comment: review.comment,
    rate: review.rating,
    replays: replays.map(r => ({
        comment: r.comment,
        replayer: r.replayer
    }))
});
exports.toReviewWithReplayDTO = toReviewWithReplayDTO;
const toReviewDTO = (review) => ({
    userId: review.userId,
    comment: review.comment,
    rate: review.rating
});
exports.toReviewDTO = toReviewDTO;
