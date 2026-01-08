// shared paths

const SHARED = '/shared',
SHARED_PAYMENT = `${SHARED}/paymets`,
SHARED_WALLET = `${SHARED}/wallet`,
SHARED_SUBSCRIPTIONS = `${SHARED}/subscriptions`,
SHARED_REVIEW = `${SHARED}/review`

export const SHARED_ROUTES = {
  paymet : {
    createPayment :(role:string) => `${SHARED_PAYMENT}/${role}/create-payment`,
  },

  wallet : {
    getWallet : (role : string) => `${SHARED_WALLET}/${role}`,
    addMoney : (role:string) => `${SHARED_WALLET}/${role}/add-money`
  },

  Review : {
    rating: (role:string,packageId:string) => `${SHARED_REVIEW}/${role}/rating/${packageId}`,
    getRiview: (role:string) => `${SHARED_REVIEW}/${role}/getReview`,
    getAllPackageReview: (role:string) => `${SHARED_REVIEW}/${role}/getAll`,
    getAllReviews:(role:string) => `${SHARED_REVIEW}/${role}/getAllReviews`,
    replayReview:(role:string) => `${SHARED_REVIEW}/${role}/replayReview`,
    getReplay:(role:string) => `${SHARED_REVIEW}/${role}/replaysForVendor`,
  },

  subscriptions : {
    getAll : (role :string) => `${SHARED_SUBSCRIPTIONS}/${role}/getAll`,
    currentSubscription : (role:string) => `${SHARED_SUBSCRIPTIONS}/${role}/current`,
    detailSubscription : (role : string,id:string) => `${SHARED_SUBSCRIPTIONS}/${role}/${id}`,
    purchase : (role:string) => `${SHARED_SUBSCRIPTIONS}/${role}/purchase`,
    activate : (role:string) => `${SHARED_SUBSCRIPTIONS}/${role}/activate`
  }
}