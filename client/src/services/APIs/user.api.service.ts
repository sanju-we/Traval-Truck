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
    login: (data: { email: string, password: string }) => post(USER_ROUTES.auth.login, data),
    logout: () => post(USER_ROUTES.auth.logout, {}),
    sendOtp: (data: { email: string }) => post(USER_ROUTES.auth.sendOtp, data),
    verifySignup: (data: any) => post(USER_ROUTES.auth.verifySignup, data),
    forgetPasswordRequest: (data: { email: string }) => post(USER_ROUTES.auth.forgetPasswordRequest, data),
    resetPassword: (data: { token: string, newPassword: string }) => post(USER_ROUTES.auth.resetPassword, data),
    googleAuth: (data: any) => post(USER_ROUTES.auth.googleAuth, data),

    // profile api requests
    getProfile: () => get(USER_ROUTES.profile.getProfile),
    intrest: (data: any) => post(USER_ROUTES.profile.intrest, data),
    editProfile: (data: any) => patch(USER_ROUTES.profile.editProfile, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    uploadImage: (data: any) => post(USER_ROUTES.profile.uploadImage, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    changePassword:(data:{oldPassword:string,newPassword:string}) => post(USER_ROUTES.profile.changePassword, data),

    // packages api requests
    getLatestPackages: () => get(USER_ROUTES.packages.getLatestPackages),
    getAllPackages: (params?: any) => get(USER_ROUTES.packages.getAllPackages, params),
    packageDetails: (id: string) => get(USER_ROUTES.packages.packageDetails(id)),
    PurchasePackage: (data: any) => post(USER_ROUTES.packages.Purchasepackage, data),
    GetAllCoupon: () => get(USER_ROUTES.packages.GetAllCoupon),

    // hotel api requests
    getAllHotel: (search: string, page?: number, limit?: number) => get(USER_ROUTES.hotel.getAllHotel, { page, limit, search }),
    getHotelDetails: (id: string) => get(`${USER_ROUTES.hotel.getAllHotel.replace('/getAll', '/details')}/${id}`),
    getRoomsByHotel: (id: string, params?: { startDate?: string; endDate?: string; people?: number }) => get(`${USER_ROUTES.hotel.getAllHotel.replace('/getAll', '/getRoomsByHotel')}/${id}`, params),
    getRoomDetails: (id: string) => get(USER_ROUTES.hotel.getRoomDetails(id)),
    purchaseRoom: (data: { roomId: string, role: string, amount: number, couponId?: string, startDate: string, people: number }) => post(USER_ROUTES.hotel.purchaseRoom, data),

    // foods api requests
    showAllFoods: (params?: any) => get(USER_ROUTES.foods.showAllFoods, params),

    // booking api request
    orderHistory: (page?: number, limit?: number) => get(USER_ROUTES.Trip.History, { page, limit }),
    getOrderDetails: (orderId: string) => get(USER_ROUTES.Trip.OrderDetail(orderId)),
    cancelOrder: (orderId: string, reason: string) => patch(USER_ROUTES.Trip.orderCancel, { orderId, reason }),
    walletPurchase :(data: {productId:string, amount:number, people:number, couponId?:string, productType:string}) => post(USER_ROUTES.purchase.walletPurchase, data),

    // Mind Map
    generateMap: (data: any) => post(USER_ROUTES.Mind_Map.GenerateTrip, data),
    updateMindMap: (data: { id: string, data: any }) => post(USER_ROUTES.Mind_Map.UpdatedateTrip, data),
    getMindMap: (page: number) => get(USER_ROUTES.Mind_Map.getMindMap, { page }),
    MindMapDetails: (id: string) => get(USER_ROUTES.Mind_Map.MindMapDetails, { id }),
    submitTheMindmap: (id: string) => post(USER_ROUTES.Mind_Map.confitmMindMap, { id })
};
