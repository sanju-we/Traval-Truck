export const toReplayDTO = (replay) => ({
    comment: replay.comment,
    reviewId: replay.reviewId,
    id: replay._id.toString(),
    replayer: replay.replayer
});
