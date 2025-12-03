// user api methods

import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from "../api.service";
import { USER_ROUTES } from "../Constant Routes/user.constant.routes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const delet = deleteRequest;

export const USER_API_METHODS = {
    // authentication api requests
    login: (data: any) => post(USER_ROUTES.auth.login, data),
    logout: () => post(USER_ROUTES.auth.logout, {}),
    sendOtp: (data: any) => post(USER_ROUTES.auth.sendOtp, data),
    verifySignup: (data: any) => post(USER_ROUTES.auth.verifySignup, data),
    forgetPasswordRequest: (data: any) => post(USER_ROUTES.auth.forgetPasswordRequest, data),
    resetPassword: (data: any) => post(USER_ROUTES.auth.resetPassword, data),
    googleAuth: (data: any) => post(USER_ROUTES.auth.googleAuth, data),

    // profile api requests
    getProfile: () => get(USER_ROUTES.profile.getProfile),
    intrest: (data: any) => post(USER_ROUTES.profile.intrest, data),
    editProfile: (data: any) => patch(USER_ROUTES.profile.editProfile, data),
    uploadImage: (data: any) => post(USER_ROUTES.profile.uploadImage, data),

    // packages api requests
    getLatestPackages: () => get(USER_ROUTES.packages.getLatestPackages),
    getAllPackages: (params?: any) => get(USER_ROUTES.packages.getAllPackages, params),
    packageDetails: (id: string) => get(USER_ROUTES.packages.packageDetails(id)),
    PurchasePackage : (data:any) => post(USER_ROUTES.packages.Purchasepackage,data),

    // hotel api requests
    getAllHotel: (params?: any) => get(USER_ROUTES.hotel.getAllHotel, params),
    getRoomDetails: (id: string) => get(USER_ROUTES.hotel.getRoomDetails(id)),

    // foods api requests
    showAllFoods: (params?: any) => get(USER_ROUTES.foods.showAllFoods, params),

    // booking api request
    orderHistory : () => get(USER_ROUTES.Trip.History)
};
