import { PaginationResponse } from "@core/DTO/pagination.DTO.js";
import { reviewDTO } from "../../../../core/DTO/shared/reviewDTO.js";
import { IReviews } from "../../../../core/interface/modelInterface/IReviews.js";

export interface IReviewService{
  create(userId:string,data:{rating:number,comment:string,vendor:string,productId:string},orderId:string):Promise<reviewDTO>
  getReview(userId:string,orderId:string) : Promise<reviewDTO>
  getAll(packageId:string,currentPage:number,reviewPerPage:number,filterRating:number):Promise<PaginationResponse<IReviews>>
}