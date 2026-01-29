"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Review_1 = require("../../models/Review");
class ReviewRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Review_1.Reviews);
    }
    async ReviewsWithPagination(curr, limit, packageId, filterRating) {
        let filter;
        if (filterRating != 0)
            filter = { productId: packageId, ratings: filterRating };
        else
            filter = { productId: packageId };
        const skip = (curr - 1) * limit;
        const reviews = await Review_1.Reviews.find(filter).lean().skip(skip).limit(limit);
        const count = await Review_1.Reviews.countDocuments(filter);
        const totalPage = Math.ceil(count / limit);
        return {
            data: reviews,
            totalPage,
            totalCount: count
        };
    }
    async averageRating(productId) {
        const result = await Review_1.Reviews.aggregate([
            { $match: { productId: productId } },
            { $group: { _id: '$productId', averageRating: { $avg: '$rating' } } }
        ]);
        if (result.length == 0)
            return { averageRating: 0 };
        return { averageRating: result[0].averageRating.toFixed(1) };
    }
    async ReviewsForVendors(curr, limit, vendorId) {
        const skip = (curr - 1) * limit;
        const reviews = await Review_1.Reviews.find({ vendor: vendorId }).lean().skip(skip).limit(limit).populate('userId');
        const totalCount = await Review_1.Reviews.countDocuments({ vendor: vendorId });
        const totalPage = Math.ceil(totalCount / limit);
        return {
            data: reviews,
            totalCount,
            totalPage
        };
    }
    async averageRatingForVendor(vendorId) {
        const avg = await Review_1.Reviews.aggregate([
            { $match: { vendor: vendorId } },
            { $group: { _id: '$vendor', avg: { $avg: '$rating' } } }
        ]);
        if (avg.length === 0)
            return { averageRating: 0 };
        return { averageRating: avg[0].avg.toFixed(1) };
    }
}
exports.ReviewRepository = ReviewRepository;
