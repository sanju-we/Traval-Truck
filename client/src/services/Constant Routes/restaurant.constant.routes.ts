const RESTAURANT = '/restaurant'
const RESTAURANT_AUTH = `${RESTAURANT}/auth`
const RESTAURANT_PROFILE = `${RESTAURANT}/profile`
const RESTAURANT_FOODS = `${RESTAURANT}/food`

export const RESTAURANT_ROUTES = {
  auth: {
    sendOtp: `${RESTAURANT_AUTH}/sendOtp`,
    verifyOtp: `${RESTAURANT_AUTH}/verify`,
    login: `${RESTAURANT_AUTH}/login`,
    logout: `${RESTAURANT_AUTH}/logout`,
    forgotPassword: `${RESTAURANT_AUTH}/forgot-password`,
    resetPassword: `${RESTAURANT_AUTH}/resetPassword`,
  },

  profile: {
    getProfile: `${RESTAURANT_PROFILE}/profile`,
    getDashboard: `${RESTAURANT_PROFILE}/dashboard`,
    edit: `${RESTAURANT_PROFILE}/update`,
    updateDocument: `${RESTAURANT_PROFILE}/update-documents`,
    deleteImage: `${RESTAURANT_PROFILE}/delete-image`,
    uploadProfile: `${RESTAURANT_PROFILE}/upload-profile`
  },

  food: {
    getFood: `${RESTAURANT_FOODS}/getFoods`,
    create: `${RESTAURANT_FOODS}/addItem`,
    edit: `${RESTAURANT_FOODS}/update`
  },

  payment: {
    create: `/shared/payments/restaurant/create-payment`
  },

  subscription: {
    purchase: `/shared/subscriptions/restaurant/purchase`
  },
}