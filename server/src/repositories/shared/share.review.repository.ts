import { BaseRepository } from "../../repositories/baseRepository";
import { IReviews } from "../../core/interface/modelInterface/IReviews";
import { Reviews } from "../../models/Review";
import { IReviewRepository } from "../../core/interface/repositorie/shared/Ishare.review.repository";
import { PaginationResponse } from "../../core/DTO/pagination.DTO";

export class ReviewRepository extends BaseRepository<IReviews> implements IReviewRepository{
  constructor(){
    super(Reviews)
  }

  async ReviewsWithPagination(curr: number, limit: number, packageId: string, filterRating: number): Promise<PaginationResponse<IReviews>> {
    let filter;
    if(filterRating != 0) filter = {productId:packageId,ratings:filterRating}
    else filter = {productId:packageId}
    const skip = (curr-1)*limit
    const reviews = await Reviews.find(filter).lean<IReviews[]>().skip(skip).limit(limit);
    const count = await Reviews.countDocuments(filter)
    const totalPage = Math.ceil(count/limit)
    return {
      data:reviews,
      totalPage,
      totalCount:count
    }
  }

  async averageRating(productId: string): Promise<{ averageRating: number; }> {
    const result = await Reviews.aggregate([
      {$match:{productId:productId}},
      {$group:{_id:'$productId',averageRating:{$avg:'$rating'}}}
    ]);
    if(result.length == 0) return {averageRating:0}
    return {averageRating : result[0].averageRating.toFixed(1)}
  }

  async ReviewsForVendors(curr: number, limit: number, vendorId: string): Promise<PaginationResponse<IReviews>> {
    const skip = (curr-1)*limit
    const reviews = await Reviews.find({vendor:vendorId}).lean<IReviews[]>().skip(skip).limit(limit).populate('userId')
    const totalCount = await Reviews.countDocuments({vendor:vendorId});
    const totalPage = Math.ceil(totalCount/limit)
    return {
      data:reviews,
      totalCount,
      totalPage
    }
  }

  async averageRatingForVendor(vendorId: string): Promise<{ averageRating: number; }> {
    const avg = await Reviews.aggregate([
      {$match:{vendor:vendorId}},
      {$group : {_id:'$vendor',avg:{$avg:'$rating'}}}
    ])
    if(avg.length === 0) return {averageRating:0}
    return {averageRating:avg[0].avg.toFixed(1)}
  }
}