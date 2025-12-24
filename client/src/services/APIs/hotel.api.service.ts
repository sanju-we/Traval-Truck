// hotel api methods

import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from "../api.service";
import { HOTEL_ROUTES } from "../Constant Routes/hotel.constant.routes";

const get = getRequest;
const post = postRequest;
const patch = patchRequest;
const put = putRequest;
const delet = deleteRequest;

export const HOTEL_API_METHODS = {
    // authentication api requests
    sendOtp: (data: any) => post(HOTEL_ROUTES.auth.sendOtp, data),
    verifyOtp: (data: any) => post(HOTEL_ROUTES.auth.verifyOtp, data),
    login: (data: any) => post(HOTEL_ROUTES.auth.login, data),
    logout: () => post(HOTEL_ROUTES.auth.logout, {}),
    forgotPassword: (data: any) => post(HOTEL_ROUTES.auth.forgotPassword, data),
    resetPassword: (data: any) => post(HOTEL_ROUTES.auth.resetPassword, data),
    dashboard: () => get(HOTEL_ROUTES.auth.dashboard),

    // profile api requests
    getProfile: () => get(HOTEL_ROUTES.profile.getProfile),
    edit: (data: any) => put(HOTEL_ROUTES.profile.edit, data),
    updateDocument: (data: any) => patch(HOTEL_ROUTES.profile.updateDocument, data),
    deleteImage: (data: any) => patch(HOTEL_ROUTES.profile.deleteImage, data),
    uploadProfile: (data: any) => patch(HOTEL_ROUTES.profile.uploadProfile, data),

    // rooms api requests
    getAllRooms: (page: number, search: string, description: string) => get(`${HOTEL_ROUTES.rooms.getAll}?page=${page}&search=${search}&Description=${description}`),
    getAll: (params?: any) => get(HOTEL_ROUTES.rooms.getAll, params),
    getRoom: (id: string) => get(HOTEL_ROUTES.rooms.getRoom(id)),
    editRoom: (id: string, data: any) => put(HOTEL_ROUTES.rooms.edit(id), data),
    create: (data: any) => post(HOTEL_ROUTES.rooms.create, data),
    updateStatus: (data: any) => patch(HOTEL_ROUTES.rooms.updateStatus, data),
    updateBlock: (data: any) => patch(HOTEL_ROUTES.rooms.updateBlock, data),
    editImage: (id: string, data: any) => patch(HOTEL_ROUTES.rooms.editImage(id), data),
    deleteRoomImage: (id: string) => patch(HOTEL_ROUTES.rooms.deleteImage(id), {}),

    // orders api 
    getAllOrders:()=> get(HOTEL_ROUTES.orders.getAll), 

    // payment api requests
    createPayment: (data: any) => post(HOTEL_ROUTES.payment.create, data),

    // subscription api requests
    purchaseSubscription: (data: any) => post(HOTEL_ROUTES.subscription.purchase, data),
};
