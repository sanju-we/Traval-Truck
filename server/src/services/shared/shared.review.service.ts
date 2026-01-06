import { IReviewService } from "../../core/interface/serivice/shared/Ishared.review.service.js";
import { inject, injectable } from "inversify";
import { IReviewRepository } from "../../core/interface/repositorie/shared/Ishare.review.repository.js";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator.js";
import { toReviewDTO,reviewDTO } from "../../core/DTO/shared/reviewDTO.js";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject('IReviewRepository') private readonly _reviewRepo: IReviewRepository,
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
  ) { }

  async create(userId: string, data: { rate: number; comment: string; vendor:string }, packageId: string): Promise<reviewDTO> {
    await this._baseValidator.reviewValidator(data)
    const reviewData = {
      vendor:data.vendor,
      packageId,
      userId,
      rating: data.rate,
      comment: data.comment
    }
    const review = await this._reviewRepo.create(reviewData)
    return toReviewDTO(review)
  }
}