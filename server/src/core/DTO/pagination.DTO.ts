import { IReplay } from "../../core/interface/modelInterface/IReplay"

export interface PaginationResponse<T>{
  data:T[],
  totalPage:number,
  totalCount:number
  averageRating?:number
  replays?:IReplay[]
}
