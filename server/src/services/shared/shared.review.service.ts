import { IReviewService } from "../../core/interface/serivice/shared/Ishared.review.service";
import { inject, injectable } from "inversify";
import { IReviewRepository } from "../../core/interface/repositorie/shared/Ishare.review.repository";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator";
import { toReviewDTO, reviewDTO } from "../../core/DTO/shared/reviewDTO";
import { BADREQUEST, DataNotFoundError } from "../../utils/resAndErrors";
import { PaginationResponse } from "../../core/DTO/pagination.DTO";
import { IReplayRepository } from "../../core/interface/repositorie/shared/Ireplay.repository";
import { IReviews } from "../../core/interface/modelInterface/IReviews";
import { IAgencyRespository } from "../../core/interface/repositorie/agency/Iagency.auth.repository";
import { IHotelAuthRepository } from "../../core/interface/repositorie/Hotel/Ihotel.auth.repository";
import { ReplayDTO, toReplayDTO } from "../../core/DTO/shared/Replay";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject('IReviewRepository') private readonly _reviewRepo: IReviewRepository,
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
    @inject('IReplayRepository') private readonly _replayRepo: IReplayRepository,
    @inject('IAgencyRespository') private readonly _agencyRepo: IAgencyRespository,
    @inject('IHotelAuthRepository') private readonly _hotelRepo: IHotelAuthRepository
  ) { }

  async create(userId: string, data: { rating: number; comment: string; vendor: string, productId: string }, orderId: string): Promise<reviewDTO> {
    await this._baseValidator.reviewValidator(data);
    await this._baseValidator.idValidator(userId);
    await this._baseValidator.idValidator(data.productId);
    await this._baseValidator.idValidator(orderId);
    const reviewData = {
      vendor: data.vendor,
      orderId,
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment
    }
    const review = await this._reviewRepo.create(reviewData)
    return toReviewDTO(review)
  }

  async getReview(userId: string, orderId: string): Promise<reviewDTO> {
    await this._baseValidator.idValidator(userId);
    await this._baseValidator.idValidator(orderId);

    const review = await this._reviewRepo.findOne({ userId, orderId });
    if (!review) throw new DataNotFoundError();

    return toReviewDTO(review)
  }

  async getAll(packageId: string, currentPage: number, reviewPerPage: number, filterRating: number): Promise<PaginationResponse<IReviews>> {
    const reviews = await this._reviewRepo.ReviewsWithPagination(currentPage, reviewPerPage, packageId, filterRating);
    const averageRating = await this._reviewRepo.averageRating(packageId)
    if (reviews.data.length <= 0) {
      return {
        data: [],
        totalPage: 0,
        totalCount: 0,
        averageRating: averageRating.averageRating
      }
    };

    return { data: reviews.data, totalPage: reviews.totalPage, totalCount: reviews.totalCount, averageRating: averageRating.averageRating }
  }

  async getAllReviews(
    vendorId: string
  ): Promise<PaginationResponse<IReviews>> {

    const allReviews = await this._reviewRepo.ReviewsForVendors(1, 5, vendorId);
    const averageRating = await this._reviewRepo.averageRatingForVendor(vendorId);

    if (!allReviews || !allReviews.data.length) {
      return {
        data: [],
        totalCount: 0,
        totalPage: 0,
        averageRating: averageRating?.averageRating ?? 0
      };
    }

    return {
      ...allReviews,
      averageRating: averageRating.averageRating
    };
  }


  async replayReview(vendorId: string, data: { replayMessage: string; reviewId: string; }, role: string): Promise<ReplayDTO> {
    await this._baseValidator.idValidator(vendorId);
    const review = await this._reviewRepo.findById(data.reviewId)
    console.log(vendorId)
    if (!review) throw new DataNotFoundError();
    if (review.isReplayed) throw new BADREQUEST();

    let vendor;
    if (role === 'agency') vendor = await this._agencyRepo.findById(vendorId)
    else if (role === 'hotel') vendor = await this._hotelRepo.findById(vendorId)
    if (!vendor) throw new DataNotFoundError()

    const replayData = {
      comment: data.replayMessage,
      replayer: vendor?.companyName,
      productId:review.productId,
      replayerId: vendorId,
      reviewId: data.reviewId
    }

    const replay = await this._replayRepo.create(replayData);
    await this._reviewRepo.update(data.reviewId, { isReplayed: true })
    return toReplayDTO(replay)
  }

  async getVendorReplays(vendorId: string): Promise<ReplayDTO[]> {
    await this._baseValidator.idValidator(vendorId);
    const replays = await this._replayRepo.findAll({ replayerId: vendorId }, {});
    if (!replays) throw new DataNotFoundError();
    console.log(replays)
    return replays.map(toReplayDTO)
  }

  async getReplaysUser(pakcageId: string): Promise<ReplayDTO[]> {
    const replays = await this._replayRepo.findAll({productId:pakcageId},{})
    if(!replays) throw new DataNotFoundError();
    return replays.map(toReplayDTO)
  }
}