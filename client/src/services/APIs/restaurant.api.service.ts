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
    sendOtp: (data: { email: string }) => post(RESTAURANT_ROUTES.auth.sendOtp, data),
    verifyOtp: (data: object) => post(RESTAURANT_ROUTES.auth.verifyOtp, data),
    login: (data: { email: string, password: string }) => post(RESTAURANT_ROUTES.auth.login, data),
    logout: () => post(RESTAURANT_ROUTES.auth.logout, {}),
    forgotPassword: (email: string) => post(RESTAURANT_ROUTES.auth.forgotPassword, { email }),
    resetPassword: (data: { token: string, newPassword: string }) => post(RESTAURANT_ROUTES.auth.resetPassword, data),

    // profile api requests
    getProfile: () => get(RESTAURANT_ROUTES.profile.getProfile),
    getDashboard: () => get(RESTAURANT_ROUTES.profile.getDashboard),
    edit: (data: FormData) => patch(RESTAURANT_ROUTES.profile.edit, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateDocument: (data: FormData) => put(RESTAURANT_ROUTES.profile.updateDocument, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteImage: (data: object) => patch(RESTAURANT_ROUTES.profile.deleteImage, data),
    uploadProfile: (data: FormData) => post(RESTAURANT_ROUTES.profile.uploadProfile, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

    // food api requests
    getFood: () => get(RESTAURANT_ROUTES.food.getFood),
    create: (data: FormData) => post(RESTAURANT_ROUTES.food.create, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    DeleteImage: (index: number, foodId: string) => patch(RESTAURANT_ROUTES.food.delete, { index, foodId }),
    editFood: (data: FormData) => patch(RESTAURANT_ROUTES.food.edit, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

    // payment api requests
    createPayment: (data: object) => post(RESTAURANT_ROUTES.payment.create, data),
    createOfflineBill: (data: object) => post(RESTAURANT_ROUTES.bill.craeteBill, { data }),

    // subscription api requests
    purchaseSubscription: (data: object) => post(RESTAURANT_ROUTES.subscription.purchase, data),
};
