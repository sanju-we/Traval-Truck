import { PaginationResponse } from "@core/DTO/pagination.DTO.js";
import { reviewDTO, reviewWithReplayDTO } from "../../../../core/DTO/shared/reviewDTO.js";
import { IReviews } from "../../../../core/interface/modelInterface/IReviews.js";
import { ReplayDTO } from "../../../../core/DTO/shared/Replay.js";
import { IReplay } from "@core/interface/modelInterface/IReplay.js";

export interface IReviewService{
  create(userId:string,data:{rating:number,comment:string,vendor:string,productId:string},orderId:string):Promise<reviewDTO>
  getReview(userId:string,orderId:string) : Promise<reviewDTO>
  getAll(packageId:string,currentPage:number,reviewPerPage:number,filterRating:number):Promise<PaginationResponse<IReviews>>
  getAllReviews(vendorId:string):Promise<PaginationResponse<IReviews>>
  replayReview(vendorId:string,data:{replayMessage:string,reviewId:string},role:string):Promise<ReplayDTO>;
  getVendorReplays(vendorId:string):Promise<ReplayDTO[]>;
}