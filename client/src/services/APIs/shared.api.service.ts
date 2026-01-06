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
  rating:(data:{rating:number,comment:string,vendor:string},role:string,pakcageId:string) => post(SHARED_ROUTES.Review.rating(role,pakcageId),data),
}