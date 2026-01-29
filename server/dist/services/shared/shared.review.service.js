var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "inversify";
import { toReviewDTO } from "../../core/DTO/shared/reviewDTO";
import { BADREQUEST, DataNotFoundError } from "../../utils/resAndErrors";
import { toReplayDTO } from "../../core/DTO/shared/Replay";
let ReviewService = class ReviewService {
    _reviewRepo;
    _baseValidator;
    _replayRepo;
    _agencyRepo;
    _hotelRepo;
    constructor(_reviewRepo, _baseValidator, _replayRepo, _agencyRepo, _hotelRepo) {
        this._reviewRepo = _reviewRepo;
        this._baseValidator = _baseValidator;
        this._replayRepo = _replayRepo;
        this._agencyRepo = _agencyRepo;
        this._hotelRepo = _hotelRepo;
    }
    async create(userId, data, orderId) {
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
        };
        const review = await this._reviewRepo.create(reviewData);
        return toReviewDTO(review);
    }
    async getReview(userId, orderId) {
        await this._baseValidator.idValidator(userId);
        await this._baseValidator.idValidator(orderId);
        const review = await this._reviewRepo.findOne({ userId, orderId });
        if (!review)
            throw new DataNotFoundError();
        return toReviewDTO(review);
    }
    async getAll(packageId, currentPage, reviewPerPage, filterRating) {
        const reviews = await this._reviewRepo.ReviewsWithPagination(currentPage, reviewPerPage, packageId, filterRating);
        const averageRating = await this._reviewRepo.averageRating(packageId);
        if (reviews.data.length <= 0) {
            return {
                data: [],
                totalPage: 0,
                totalCount: 0,
                averageRating: averageRating.averageRating
            };
        }
        ;
        return { data: reviews.data, totalPage: reviews.totalPage, totalCount: reviews.totalCount, averageRating: averageRating.averageRating };
    }
    async getAllReviews(vendorId) {
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
    async replayReview(vendorId, data, role) {
        await this._baseValidator.idValidator(vendorId);
        const review = await this._reviewRepo.findById(data.reviewId);
        console.log(vendorId);
        if (!review)
            throw new DataNotFoundError();
        if (review.isReplayed)
            throw new BADREQUEST();
        let vendor;
        if (role === 'agency')
            vendor = await this._agencyRepo.findById(vendorId);
        else if (role === 'hotel')
            vendor = await this._hotelRepo.findById(vendorId);
        if (!vendor)
            throw new DataNotFoundError();
        const replayData = {
            comment: data.replayMessage,
            replayer: vendor?.companyName,
            productId: review.productId,
            replayerId: vendorId,
            reviewId: data.reviewId
        };
        const replay = await this._replayRepo.create(replayData);
        await this._reviewRepo.update(data.reviewId, { isReplayed: true });
        return toReplayDTO(replay);
    }
    async getVendorReplays(vendorId) {
        await this._baseValidator.idValidator(vendorId);
        const replays = await this._replayRepo.findAll({ replayerId: vendorId }, {});
        if (!replays)
            throw new DataNotFoundError();
        console.log(replays);
        return replays.map(toReplayDTO);
    }
    async getReplaysUser(pakcageId) {
        const replays = await this._replayRepo.findAll({ productId: pakcageId }, {});
        if (!replays)
            throw new DataNotFoundError();
        return replays.map(toReplayDTO);
    }
};
ReviewService = __decorate([
    injectable(),
    __param(0, inject('IReviewRepository')),
    __param(1, inject('IBaseValidator')),
    __param(2, inject('IReplayRepository')),
    __param(3, inject('IAgencyRespository')),
    __param(4, inject('IHotelAuthRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ReviewService);
export { ReviewService };
