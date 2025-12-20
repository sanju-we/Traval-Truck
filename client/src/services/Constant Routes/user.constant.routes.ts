// user paths

const BASE = `/user`
const USER_AUTH = `${BASE}/auth`
const USER_PROFILE = `${BASE}/profile`
const USER_PACKAGE =  `${BASE}/packages`
const USER_HOTELS = `${BASE}/hotels`
const USER_FOODS = `${BASE}/foods`
const USER_TRIP = `${BASE}/trip`

export const USER_ROUTES = {
  auth : {
    login : `${USER_AUTH}/login`,
    logout : `${USER_AUTH}/logout`,
    sendOtp : `${USER_AUTH}/sendOtp`,
    verifySignup : `${USER_AUTH}/verify`,
    forgetPasswordRequest : `${USER_AUTH}/forgot-password`,
    resetPassword : `${USER_AUTH}/reset-password`,
    googleAuth : `${USER_AUTH}/google`
  },

  profile : {
    getProfile : `${USER_PROFILE}/profile`,
    intrest : `${USER_PROFILE}/intrest`,
    editProfile : `${USER_PROFILE}/update`,
    uploadImage : `${USER_PROFILE}/upload-profle`
  },

  packages : {
    getLatestPackages : `${USER_PACKAGE}`,
    getAllPackages : `${USER_PACKAGE}/getAll`,
    packageDetails :(id:string) => `${USER_PACKAGE}/getPackage/${id}`,
    Purchasepackage : `${USER_PACKAGE}/purchase`,
    GetAllCoupon : `${USER_PACKAGE}/coupon`
  },

  hotel : {
    getAllHotel : `${USER_HOTELS}/getAll`,
    getRoomDetails :(id:string) => `${USER_HOTELS}/getRoom/${id}`
  },

  foods : {
    showAllFoods : `${USER_FOODS}/getAll`
  },

  Trip : {
    History : `${USER_TRIP}/tripHistory`,
    OrderDetail : (orderId:string)=>`${USER_TRIP}/orderDetails/${orderId}`,
    orderCancel : `${USER_TRIP}/cancelOrder`
  }
} 