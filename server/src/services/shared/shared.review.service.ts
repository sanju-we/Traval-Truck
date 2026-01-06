import { IReviewService } from "../../core/interface/serivice/shared/Ishared.review.service.js";
import { inject, injectable } from "inversify";
import { IReviewRepository } from "../../core/interface/repositorie/shared/Ishare.review.repository.js";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator.js";
import { toReviewDTO,reviewDTO } from "../../core/DTO/shared/reviewDTO.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject('IReviewRepository') private readonly _reviewRepo: IReviewRepository,
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
  ) { }

  async create(userId: string, data: { rating: number; comment: string; vendor:string }, orderId: string): Promise<reviewDTO> {
    await this._baseValidator.reviewValidator(data);
    await this._baseValidator.idValidator(userId);
    await this._baseValidator.idValidator(orderId);
    const reviewData = {
      vendor:data.vendor,
      orderId,
      userId,
      rating: data.rating,
      comment: data.comment
    }
    const review = await this._reviewRepo.create(reviewData)
    return toReviewDTO(review)
  }

  async getReview(userId: string, orderId: string): Promise<reviewDTO> {
    await this._baseValidator.idValidator(userId);
    await this._baseValidator.idValidator(orderId);

    const review = await this._reviewRepo.findOne({userId,orderId});
    if(!review) throw new DataNotFoundError();

    return toReviewDTO(review)
  }
}