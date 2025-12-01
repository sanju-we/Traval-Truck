// restaurant api methods

import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from "../api.service";
import { RESTAURANT_ROUTES } from "../Constant Routes/restaurant.constant.routes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const delet = deleteRequest;

export const RESTAURANT_API_METHODS = {
    // authentication api requests
    sendOtp: (data: any) => post(RESTAURANT_ROUTES.auth.sendOtp, data),
    verifyOtp: (data: any) => post(RESTAURANT_ROUTES.auth.verifyOtp, data),
    login: (data: any) => post(RESTAURANT_ROUTES.auth.login, data),
    logout: () => post(RESTAURANT_ROUTES.auth.logout, {}),
    forgotPassword: (data: any) => post(RESTAURANT_ROUTES.auth.forgotPassword, data),
    resetPassword: (data: any) => post(RESTAURANT_ROUTES.auth.resetPassword, data),

    // profile api requests
    getProfile: () => get(RESTAURANT_ROUTES.profile.getProfile),
    getDashboard: () => get(RESTAURANT_ROUTES.profile.getDashboard),
    edit: (data: any) => put(RESTAURANT_ROUTES.profile.edit, data),
    updateDocument: (data: any) => patch(RESTAURANT_ROUTES.profile.updateDocument, data),
    deleteImage: (data: any) => patch(RESTAURANT_ROUTES.profile.deleteImage, data),
    uploadProfile: (data: any) => patch(RESTAURANT_ROUTES.profile.uploadProfile, data),

    // food api requests
    getFood: (params?: any) => get(RESTAURANT_ROUTES.food.getFood, params),
    create: (data: any) => post(RESTAURANT_ROUTES.food.create, data),
    editFood: (data: any) => patch(RESTAURANT_ROUTES.food.edit, data),

    // payment api requests
    createPayment: (data: any) => post(RESTAURANT_ROUTES.payment.create, data),

    // subscription api requests
    purchaseSubscription: (data: any) => post(RESTAURANT_ROUTES.subscription.purchase, data),
};
