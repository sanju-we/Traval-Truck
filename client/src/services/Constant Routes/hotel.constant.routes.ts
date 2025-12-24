// hotel paths 

const HOTEL = '/hotel'
const HOTEL_AUTH = `${HOTEL}/auth`
const HOTEL_PROFILE = `${HOTEL}/profile`
const HOTEL_ROOMS = `${HOTEL}/rooms`
const HOTEL_ORDERS = `${HOTEL}/orders`

export const HOTEL_ROUTES = {
  auth: {
    sendOtp: `${HOTEL_AUTH}/sendOtp`,
    verifyOtp: `${HOTEL_AUTH}/verify`,
    login: `${HOTEL_AUTH}/login`,
    logout: `${HOTEL_AUTH}/logout`,
    forgotPassword: `${HOTEL_AUTH}/forgot-password`,
    resetPassword: `${HOTEL_AUTH}/resetPassword`,
    dashboard: `${HOTEL_AUTH}/dashboard`
  },

  profile: {
    getProfile: `${HOTEL_PROFILE}/profile`,
    edit: `${HOTEL_PROFILE}/update`,
    updateDocument: `${HOTEL_PROFILE}/update-documents`,
    deleteImage: `${HOTEL_PROFILE}/delete-image`,
    uploadProfile: `${HOTEL_PROFILE}/upload-profile`
  },

  rooms: {
    getAll: `${HOTEL_ROOMS}/getAllRooms`,
    getRoom: (id: string) => `${HOTEL_ROOMS}/getAllRoom/${id}`,
    edit: (id: string) => `${HOTEL_ROOMS}/getRoom/${id}/edit`,
    create: `${HOTEL_ROOMS}/addRooms`,
    updateStatus: `${HOTEL_ROOMS}/updateStatus`,
    updateBlock: `${HOTEL_ROOMS}/updateBlock`,
    editImage: (id: string) => `${HOTEL_ROOMS}/update/${id}`,
    deleteImage: (id: string) => `${HOTEL_ROOMS}/deleteImage/${id}`,
  },

  orders:{
    getAll : `${HOTEL_ORDERS}/getAll`,
    getOrder :(orderId:string)=> `${HOTEL_ORDERS}/getOrder/${orderId}`,
    checkIn : (orderId:string) => `${HOTEL_ORDERS}/check-in/${orderId}`,
    checkOut : (orderId:string) => `${HOTEL_ORDERS}/check-out/${orderId}`
  },

  payment: {
    create: `/shared/payments/hotel/create-payment`
  },

  subscription: {
    purchase: `/shared/subscriptions/hotel/purchase`
  }
}