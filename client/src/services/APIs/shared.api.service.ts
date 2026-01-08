import { getRequest, deleteRequest, patchRequest, postRequest, putRequest } from "../api.service";
import { SHARED_ROUTES } from "../Constant Routes/shared.constant.routes";

const get = getRequest
const post = postRequest

export const SHARED_API_METHODS = {
  createPayment : (role:string, body:any) => post(SHARED_ROUTES.paymet.createPayment(role),body),

  getWallet : (role:string) => get(SHARED_ROUTES.wallet.getWallet(role)),

  getAllSubscriptions : (role:string) => get(SHARED_ROUTES.subscriptions.getAll(role)),
  currentSubscription : (role:string) => get(SHARED_ROUTES.subscriptions.currentSubscription(role)),
  subscriptionDetails : (role:string,id:string) => get(SHARED_ROUTES.subscriptions.detailSubscription(role,id)),
  purchaseSubscription : (role:string) => post(SHARED_ROUTES.subscriptions.purchase(role),{}),

  rating:(data:{rating:number,comment:string,vendor:string, productId:string},role:string,orderId:string) => post(SHARED_ROUTES.Review.rating(role,orderId),data),
  getRating:(role:string,orderId:string) => get(SHARED_ROUTES.Review.getRiview(role),{orderId}),
  getPackageReviews:(data:{packageId:string,currentPage:number,reviewPerPage:number,filterRating:number},role:string) => get(SHARED_ROUTES.Review.getAllPackageReview(role),data),
  getAllReviews:(role:string,curr:number,limi:number,rating:number|null) => get(SHARED_ROUTES.Review.getAllReviews(role)),
  replyToReview:(role:string,reviewId:string,replayMessage:string) => post(SHARED_ROUTES.Review.replayReview(role),{reviewId,replayMessage}),
  getReplays:(role:string,vendorId:string) => get(SHARED_ROUTES.Review.getReplay(role),{vendorId})
}