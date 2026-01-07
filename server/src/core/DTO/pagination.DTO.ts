
export interface PaginationResponse<T>{
  data:T[],
  totalPage:number,
  totalCount:number
  averageRating?:number
}
