import { reviewDTO } from "../../../../core/DTO/shared/reviewDTO.js";

export interface IReviewService{
  create(userId:string,data:{rate:number,comment:string,vendor:string},packageId:string):Promise<reviewDTO>
}