import { BaseRepository } from "../../repositories/baseRepository.js";
import { IReviews } from "../../core/interface/modelInterface/IReviews.js";
import { Reviews } from "../../models/Review.js";
import { IReviewRepository } from "../../core/interface/repositorie/shared/Ishare.review.repository.js";

export class ReviewRepository extends BaseRepository<IReviews> implements IReviewRepository{
  constructor(){
    super(Reviews)
  }
}