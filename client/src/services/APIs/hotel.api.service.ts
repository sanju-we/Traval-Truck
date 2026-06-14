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
    sendOtp: (data: { email: string }) => post(HOTEL_ROUTES.auth.sendOtp, data),
    verifyOtp: (data: object) => post(HOTEL_ROUTES.auth.verifyOtp, data),
    login: (data: { email: string, password: string }) => post(HOTEL_ROUTES.auth.login, data),
    logout: () => post(HOTEL_ROUTES.auth.logout, {}),
    forgotPassword: (email: string) => post(HOTEL_ROUTES.auth.forgotPassword, { email }),
    resetPassword: (data: { token: string, newPassword: string }) => post(HOTEL_ROUTES.auth.resetPassword, data),
    dashboard: () => get(HOTEL_ROUTES.auth.dashboard),

    // profile api requests
    getProfile: () => get(HOTEL_ROUTES.profile.getProfile),
    edit: (data: FormData) => patch(HOTEL_ROUTES.profile.edit, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateDocument: (data: FormData) => put(HOTEL_ROUTES.profile.updateDocument, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteImage: (data: object) => patch(HOTEL_ROUTES.profile.deleteImage, data),
    uploadProfile: (data: FormData) => post(HOTEL_ROUTES.profile.uploadProfile, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

    // rooms api requests
    getAllRooms: (page: number, search: string, description: string) => get(`${HOTEL_ROUTES.rooms.getAll}?page=${page}&search=${search}&Description=${description}`),
    getAll: (params?: object) => get(HOTEL_ROUTES.rooms.getAll, params),
    getRoom: (id: string) => get(HOTEL_ROUTES.rooms.getRoom(id)),
    editRoom: (id: string, data: object) => put(HOTEL_ROUTES.rooms.edit(id), data),
    create: (data: FormData) => post(HOTEL_ROUTES.rooms.create, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateStatus: (data: object) => patch(HOTEL_ROUTES.rooms.updateStatus, data),
    updateBlock: (data: object) => patch(HOTEL_ROUTES.rooms.updateBlock, data),
    editImage: (id: string, data: FormData) => patch(HOTEL_ROUTES.rooms.editImage(id), data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteRoomImage: (id: string) => patch(HOTEL_ROUTES.rooms.deleteImage(id), {}),

    // orders api 
    getAllOrders: () => get(HOTEL_ROUTES.orders.getAll),
    getOrderDetails: (orderId: string) => get(HOTEL_ROUTES.orders.getOrder(orderId)),
    checkInOrder: (orderId: string) => patch(HOTEL_ROUTES.orders.checkIn(orderId), {}),
    checkOutOrder: (orderId: string) => patch(HOTEL_ROUTES.orders.checkOut(orderId), {}),

    // payment api requests
    createPayment: (data: object) => post(HOTEL_ROUTES.payment.create, data),
    purchaseSubscription: (data: object) => post(HOTEL_ROUTES.subscription.purchase, data),
};
