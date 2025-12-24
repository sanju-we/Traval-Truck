// Base paths 
const ADMIN_BASE = '/admin'
const ADMIN_AUTH = `${ADMIN_BASE}/auth`
const ADMIN_VENDOR =  `${ADMIN_BASE}/vendor`
const ADMIN_SUBSCRIPTION = `${ADMIN_BASE}/subscription`
const ADMIN_COUPONS = `${ADMIN_BASE}/coupons`
const ADMIN_ORDERS = `${ADMIN_BASE}/orders`

export const ADMIN_ROUTES = {
  auth:{
    login:`${ADMIN_AUTH}/login`,
    logout:`${ADMIN_AUTH}/logout`
  },

  vendor:{
    getAllRequest:`${ADMIN_VENDOR}/allRequests`,
    getAllUser:`${ADMIN_VENDOR}/allUsers`,
    block:(id:string,role:string) => `${ADMIN_VENDOR}/block-toggle/${id}/${role}`,
    updateStatus:(id:string,action:string,role:string) => `${ADMIN_VENDOR}/${id}/${action}/${role}`
  },

  subscription:{
    create:`${ADMIN_SUBSCRIPTION}/add`,
    getAllSubcription:`${ADMIN_SUBSCRIPTION}/getAll`,
    editSubscription:(id:string) => `${ADMIN_SUBSCRIPTION}/update/${id}`,
    updateStatus:(id:string) =>  `${ADMIN_SUBSCRIPTION}/tongle/${id}`
  },

  coupons:{
    getAllCoupons : `${ADMIN_COUPONS}/all`,
    create : `${ADMIN_COUPONS}/add`,
    editCoupons : (id:string) => `${ADMIN_COUPONS}/edit/${id}`,
    updateStatus : (id:string) => `${ADMIN_COUPONS}/tongle/${id}`
  },

  orders:{
    getAll : `${ADMIN_ORDERS}/all`
  }
}