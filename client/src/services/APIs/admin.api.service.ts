// admin api methods

import { getRequest,postRequest,putRequest,patchRequest,deleteRequest } from "../api.service";
import { ADMIN_ROUTES } from "../Constant Routes/admin.constatnt.routes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const delet = deleteRequest;

export const ADMIN_API_METHODS = {
  // authentication api requestes
  login : (data:{email:string,password:string}) => post(ADMIN_ROUTES.auth.login,data),
  logout : () => post(ADMIN_ROUTES.auth.logout,{}),

  // vendor api requestes
  fetchAllRequest : (params?: { search?: string })=> get(ADMIN_ROUTES.vendor.getAllRequest,params),
  updateStatus : (id:string,action:string,role:string,reason?:string) => patch(ADMIN_ROUTES.vendor.updateStatus(id,action,role),{reason}),
  getAllUsers : (id:string,action:string,role:string) => get(ADMIN_ROUTES.vendor.getAllUser,{}),
  blockUser : (id:string,role:string) => patch(ADMIN_ROUTES.vendor.block(id,role),{}),

  // coupon api requests
  fetchAllCoupons : () => get(ADMIN_ROUTES.coupons.getAllCoupons),
  createCoupon : (data:any) => post(ADMIN_ROUTES.coupons.create,data),
  edit : (data:any,id:string) => patch(ADMIN_ROUTES.coupons.editCoupons(id),data),
  editStatus : (id:string) => put(ADMIN_ROUTES.coupons.updateStatus(id),{}),

  // subscription api requests
  fetchAllSubscriptions : () => get(ADMIN_ROUTES.subscription.getAllSubcription),
  createSubscription : (data:any) => post(ADMIN_ROUTES.subscription.create,data),
  editSubscription : (data:any,id:string) => put(ADMIN_ROUTES.subscription.editSubscription(id),data),
  editSubscriptionStatus : (id:string) => put(ADMIN_ROUTES.subscription.updateStatus(id),{})
}