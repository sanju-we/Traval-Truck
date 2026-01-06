import { IReviews } from "@core/interface/modelInterface/IReviews"

export interface reviewDTO{
  userId:string,
  comment:string,
  rate:number
}

export const toReviewDTO = (review:IReviews):reviewDTO => ({
  userId:review.userId,
  comment:review.comment,
  rate:review.rating
})