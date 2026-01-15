import { PaginationResponse } from "@core/DTO/pagination.DTO";
import { reviewDTO, reviewWithReplayDTO } from "../../../../core/DTO/shared/reviewDTO";
import { IReviews } from "../../../../core/interface/modelInterface/IReviews";
import { ReplayDTO } from "../../../../core/DTO/shared/Replay";
import { IReplay } from "@core/interface/modelInterface/IReplay";

export interface IReviewService{
  create(userId:string,data:{rating:number,comment:string,vendor:string,productId:string},orderId:string):Promise<reviewDTO>
  getReview(userId:string,orderId:string) : Promise<reviewDTO>
  getAll(packageId:string,currentPage:number,reviewPerPage:number,filterRating:number):Promise<PaginationResponse<IReviews>>
  getAllReviews(vendorId:string):Promise<PaginationResponse<IReviews>>
  replayReview(vendorId:string,data:{replayMessage:string,reviewId:string},role:string):Promise<ReplayDTO>;
  getVendorReplays(vendorId:string):Promise<ReplayDTO[]>;
  getReplaysUser(pakcageId:string):Promise<ReplayDTO[]>
}