import { IBaserepository } from "../IBaseRepositories";
import { IReviews } from "../../../../core/interface/modelInterface/IReviews.js";
import { PaginationResponse } from "../../../../core/DTO/pagination.DTO";

export interface IReviewRepository extends IBaserepository<IReviews>{
  ReviewsWithPagination(curr:number,limit:number,packageId:string,filterRating:number):Promise<PaginationResponse<IReviews>>;
  averageRating(productId:string):Promise<{averageRating:number}>
}