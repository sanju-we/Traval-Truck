// shared paths

const SHARED = '/shared',
SHARED_PAYMENT = `${SHARED}/paymets`,
SHARED_WALLET = `${SHARED}/wallet`,
SHARED_SUBSCRIPTIONS = `${SHARED}/subscriptions`

export const SHARED_ROUTES = {
  paymet : {
    createPayment :(role:string) => `${SHARED_PAYMENT}/${role}/create-payment`,
  },

  wallet : {
    getWallet : (role : string) => `${SHARED_WALLET}/${role}`,
    addMoney : (role:string) => `${SHARED_WALLET}/${role}/add-money`
  },

  subscriptions : {
    getAll : (role :string) => `${SHARED_SUBSCRIPTIONS}/${role}/getAll`,
    currentSubscription : (role:string) => `${SHARED_SUBSCRIPTIONS}/${role}/current`,
    detailSubscription : (role : string,id:string) => `${SHARED_SUBSCRIPTIONS}/${role}/${id}`,
    purchase : (role:string) => `${SHARED_SUBSCRIPTIONS}/${role}/purchase`,
    activate : (role:string) => `${SHARED_SUBSCRIPTIONS}/${role}/activate`
  }
}