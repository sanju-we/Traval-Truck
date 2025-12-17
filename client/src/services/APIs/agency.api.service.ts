// agency api methods

import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from "../api.service";
import { AGENCY_ROUTES } from "../Constant Routes/agency.constant.routes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const delet = deleteRequest;

export const AGENCY_API_METHODS = {
    // authentication api requests
    sendOtp: (data: any) => post(AGENCY_ROUTES.auth.sendOtp, data),
    verifyOtp: (data: any) => post(AGENCY_ROUTES.auth.verifyOtp, data),
    login: (data: any) => post(AGENCY_ROUTES.auth.login, data),
    logout: () => post(AGENCY_ROUTES.auth.logout, {}),
    forgotPassword: (data: any) => post(AGENCY_ROUTES.auth.forgotPassword, data),
    resetPassword: (data: any) => post(AGENCY_ROUTES.auth.resetPassword, data),

    // profile api requests
    getProfile: () => get(AGENCY_ROUTES.profile.getProfile),
    getDashboard: () => get(AGENCY_ROUTES.profile.getDashboard),
    edit: (data: any) => patch(AGENCY_ROUTES.profile.edit, data),
    updateDocument: (data: any) => put(AGENCY_ROUTES.profile.updateDocument, data),
    deleteImage: (data: any) => delet(AGENCY_ROUTES.profile.deleteImage, { data }),
    uploadProfile: (data: any) => post(AGENCY_ROUTES.profile.uploadProfile, data),

    // package api requests
    getAll: (params?: any) => get(AGENCY_ROUTES.package.getAll, params),
    create: (data: any) => post(AGENCY_ROUTES.package.create, data),
    editPackage: (id: string, data: any) => put(AGENCY_ROUTES.package.edit(id), data),
    deletePackageImage: (id: string, data: any) => patch(AGENCY_ROUTES.package.deleteImage(id), data),

    // payment api requests
    createPayment: (data: any) => post(AGENCY_ROUTES.payment.create, data),

    // subscription api requests
    purchaseSubscription: (data: any) => post(AGENCY_ROUTES.subscription.purchase, data),

    // orders api
    getAllOrders : () => get(AGENCY_ROUTES.orders.getAll),
    setOrderStartDate : (orderId:string,date:string) => post(AGENCY_ROUTES.orders.setStartDate,{orderId,date}),
    getOrder : (orderId:string) => get(AGENCY_ROUTES.orders.getOrder(orderId))
};
