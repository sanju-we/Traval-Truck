import { IReplay } from "@core/interface/modelInterface/IReplay"
import { IReviews } from "@core/interface/modelInterface/IReviews"

export interface reviewDTO{
  userId:string,
  comment:string,
  rate:number
}

export interface reviewWithReplayDTO {
  userId: string;
  comment: string;
  rate: number;
  replays: {
    comment: string;
    replayer: string;
  }[];
}

export const toReviewWithReplayDTO = (
  review: IReviews,
  replays: IReplay[]
): reviewWithReplayDTO => ({
  userId: review.userId,
  comment: review.comment,
  rate: review.rating,
  replays: replays.map(r => ({
    comment: r.comment,
    replayer: r.replayer
  }))
});

export const toReviewDTO = (review:IReviews):reviewDTO => ({
  userId:review.userId,
  comment:review.comment,
  rate:review.rating
})