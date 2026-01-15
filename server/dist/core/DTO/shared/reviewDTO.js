export const toReviewWithReplayDTO = (review, replays) => ({
    userId: review.userId,
    comment: review.comment,
    rate: review.rating,
    replays: replays.map(r => ({
        comment: r.comment,
        replayer: r.replayer
    }))
});
export const toReviewDTO = (review) => ({
    userId: review.userId,
    comment: review.comment,
    rate: review.rating
});
