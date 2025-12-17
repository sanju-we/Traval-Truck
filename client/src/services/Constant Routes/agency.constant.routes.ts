// agency paths

const AGENCY = `/agency`
const AGENCY_AUTH = `${AGENCY}/auth`
const AGENCY_PROFILE = `${AGENCY}/profile`
const AGENCY_PACKAGE = `${AGENCY}/package`
const AGENCY_ORDERS =  `${AGENCY}/orders`

export const AGENCY_ROUTES = {
  auth: {
    sendOtp: `${AGENCY_AUTH}/sendOtp`,
    verifyOtp: `${AGENCY_AUTH}/verify`,
    login: `${AGENCY_AUTH}/login`,
    logout: `${AGENCY_AUTH}/logout`,
    forgotPassword: `${AGENCY_AUTH}/forgot-password`,
    resetPassword: `${AGENCY_AUTH}/resetPassword`,
  },

  profile: {
    getProfile: `${AGENCY_PROFILE}/profile`,
    getDashboard: `${AGENCY_PROFILE}/dashboard`,
    edit: `${AGENCY_PROFILE}/update`,
    updateDocument: `${AGENCY_PROFILE}/update-documents`,
    deleteImage: `${AGENCY_PROFILE}/delete-image`,
    uploadProfile: `${AGENCY_PROFILE}/upload-profile`
  },

  package: {
    getAll: `${AGENCY_PACKAGE}/getAllPackages`,
    create: `${AGENCY_PACKAGE}/addPackage`,
    edit: (id: string) => `${AGENCY_PACKAGE}/update/${id}`,
    deleteImage: (id: string) => `${AGENCY_PACKAGE}/deleteImage/${id}`,
  },

  payment: {
    create: `/shared/payments/agency/create-payment`
  },

  subscription: {
    purchase: `/shared/subscriptions/agency/purchase`
  },

  orders:{
    getAll:`${AGENCY_ORDERS}/getAll`,
    setStartDate : `${AGENCY_ORDERS}/setDate`,
    getOrder :(orderId:string)=> `${AGENCY_ORDERS}/getOrder/${orderId}`
  }
}