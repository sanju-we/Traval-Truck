// agency api methods

import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from "../api.service";
import { AGENCY_ROUTES } from "../Constant Routes/agency.constant.routes";
import api from "../api";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const delet = deleteRequest;

export const AGENCY_API_METHODS = {
    // authentication api requests
    sendOtp: (data: { email: string }) => post(AGENCY_ROUTES.auth.sendOtp, data),
    verifyOtp: (data: any) => post(AGENCY_ROUTES.auth.verifyOtp, data),
    login: (data: { email: string, password: string }) => post(AGENCY_ROUTES.auth.login, data),
    logout: () => post(AGENCY_ROUTES.auth.logout, {}),
    forgotPassword: (email: string) => post(AGENCY_ROUTES.auth.forgotPassword, { email }),
    resetPassword: (data: { token: string, newPassword: string }) => post(AGENCY_ROUTES.auth.resetPassword, data),

    // profile api requests
    getProfile: () => get(AGENCY_ROUTES.profile.getProfile),
    getDashboard: () => get(AGENCY_ROUTES.profile.getDashboard),
    edit: (data: any) => patch(AGENCY_ROUTES.profile.edit, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateDocument: (data: any) => put(AGENCY_ROUTES.profile.updateDocument, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteImage: (data: any) => delet(AGENCY_ROUTES.profile.deleteImage, { data }),
    uploadProfile: (data: any) => post(AGENCY_ROUTES.profile.uploadProfile, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // package api requests
    getAll: (params?: any) => get(AGENCY_ROUTES.package.getAll, params),
    create: (data: any) => api.post(AGENCY_ROUTES.package.create, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    editPackage: (id: string, data: any) => api.patch(AGENCY_ROUTES.package.edit(id), data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    deletePackageImage: (id: string, data: any) => patch(AGENCY_ROUTES.package.deleteImage(id), data),

    // payment api requests
    createPayment: (data: any) => post(AGENCY_ROUTES.payment.create, data),

    // subscription api requests
    purchaseSubscription: (data: any) => post(AGENCY_ROUTES.subscription.purchase, data),

    // orders api
    getAllOrders: () => get(AGENCY_ROUTES.orders.getAll),
    setOrderStartDate: (orderId: string, date: string) => post(AGENCY_ROUTES.orders.setStartDate, { orderId, date }),
    getOrder: (orderId: string) => get(AGENCY_ROUTES.orders.getOrder(orderId)),
    startTrip: (orderId: string) => post(AGENCY_ROUTES.orders.startTrip(orderId), {}),
    completeDayItinerary: (orderId: string, day: number) => post(AGENCY_ROUTES.orders.completeDayItinerary(orderId), { day }),
    completeTrip: (orderId: string) => post(AGENCY_ROUTES.orders.completeTrip(orderId), { completeTrip: true }),
    completeActivity: (orderId: string, day: number, activityIndex: number) => post(AGENCY_ROUTES.orders.completeActivityItinerary(orderId), { day, activityIndex }),
};
