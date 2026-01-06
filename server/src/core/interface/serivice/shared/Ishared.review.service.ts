import { reviewDTO } from "../../../../core/DTO/shared/reviewDTO.js";

export interface IReviewService{
  create(userId:string,data:{rating:number,comment:string,vendor:string},orderId:string):Promise<reviewDTO>
  getReview(userId:string,orderId:string) : Promise<reviewDTO>
}