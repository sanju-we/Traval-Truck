// --------------------------------------------------general----------------------------------------------------------------
import { Container } from 'inversify';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { JWT } from '../../utils/JWTtoken.js';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet.js';
import { RedisClient } from '../../config/redisClient.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import { EmailService } from '../../services/email.service.js';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service.js';
import { GeneralService } from '../../services/general.service.js';
import { ISubscriptionRepository } from '../../core/interface/repositorie/ISubscription.respository.js';
import { SubscriptionRepository } from '../../repositories/subscription.repository.js';
import { IAuthValidator } from '../interface/validator/Iauth.validator.js';
import { authValidator } from '../../validators/auth.validator.js';
import { ISubscriptionValidator } from '../../core/interface/validator/Isubscription.validator.js';
import { SubscriptionValidator } from '../../validators/subscription.validator.js';
import { ICouponValidator } from '../../core/interface/validator/Icoupon.validator.js';
import { CouponValidator } from '../../validators/coupon.validator.js';
import { IPaymentValidator } from '../../core/interface/validator/Ipayment.validator.js';
import { PaymentValidator } from '../../validators/payment.validator.js';

// ------------------------------------------------------shares-------------------------------------------------------------
import { IWalletService } from '../interface/serivice/shared/IWaller.service.js';
import { WalletService } from '../../services/shared/wallet.service.js';
import { ISharedWalletController } from '../../core/interface/controllerInterface/shared/Ishared.wallet.controller.js';
import { SharedWalletController } from '../../controllers/sharedController/shared.wallet.controller.js';
import { IWalletRespository } from '../../core/interface/repositorie/shared/IWallet.repository.js';
import { WalletRespository } from '../../repositories/shared/wallet.repository.js';
import { ISharedSubscriptionController } from '../../core/interface/controllerInterface/shared/Ishared.subscription.controller.js';
import { SharedSubscriptionController } from '../../controllers/sharedController/subscription.controller.js';
import { ISharedSubscriptionService } from '../../core/interface/serivice/shared/Ishared.subscription.service.js';
import { SharedSubscriptionService } from '../../services/shared/shared.subscrtiption.service.js';
import { ISubscriptionHistoryRepository } from '../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js';
import { subscriptionHistoryRepository } from '../../repositories/shared/subscription.history.repository.js';

// ----------------------------------------------------user-------------------------------------------------------------
import { IAuthService } from '../../core/interface/serivice/user/auth.interface.js';
import { IAuthRepository } from '../interface/repositorie/IAuth.Repository.js';
import { AuthService } from '../../services/user/auth.service.js';
import { AuthRepository } from '../../repositories/user/auth.repository.js';
import { AuthController } from '../../controllers/userController/user.auth.controller.js';
import { IController } from '../../core/interface/controllerInterface/user/user.Interface.js';
import { ProfileController } from '../../controllers/userController/user.profile.controller.js';
import { IUserProfileController } from '../../core/interface/controllerInterface/user/userProfile.js';
import { IUserProfileService } from '../../core/interface/serivice/user/Iuser.profile.service.js';
import { UserProfileService } from '../../services/user/user.profile.service.js';
import { IUserPackageController } from '../../core/interface/controllerInterface/user/Iuser.package.controller.js';
import { UserPackageController } from '../../controllers/userController/user.package.controller.js';
import { IUserPackageService } from '../../core/interface/serivice/user/IUser.package.service.js';
import { UserPackageSerivce } from '../../services/user/user.package.service.js';
import { IUserHotelsController } from '../../core/interface/controllerInterface/user/Iuser.hotels.controller.js';
import { UserHotelsController } from '../../controllers/userController/user.hotels.controller.js';
import { IUserHotelsService } from '../../core/interface/serivice/user/IUser.hotels.service.js';
import { UserHotelsService } from '../../services/user/user.hotels.service.js';
import { IPaymentController } from '../interface/controllerInterface/shared/Ishared.payment.controller.js';
import { UserPaymentController } from '../../controllers/sharedController/payment.controller.js';
import { IPaymentUtils } from '../interface/PaymentInterface/Ipayment.utils.js';
import { PaymentUtils } from '../../utils/payment.utils.js';
import { IUserFoodsController } from '../../core/interface/controllerInterface/user/IUser.foods.controller.js';
import { userFoodsController } from '../../controllers/userController/user.foods.controller.js';
import { IUserFoodsService } from '../../core/interface/serivice/user/IUser.foods.service.js';
import { userFoodsService } from '../../services/user/user.foods.service.js';

// ----------------------------------------------------admin--------------------------------------------------------------------
import { IAdminAuthService } from '../interface/serivice/admin/IAdmin.auth.service.js';
import { AdminAuthService } from '../../services/admin/admin.auth.service.js';
import { AdminAuthController } from '../../controllers/adminController/admin.auth.controller.js';
import { IAdminAuthController } from '../../core/interface/controllerInterface/admin/IAuth.controller.js';
import { IAdminVendorController } from '../../core/interface/controllerInterface/admin/Iadmin.vendor.controller.js';
import { AdminVendorController } from '../../controllers/adminController/admin.vendor.controller.js';
import { IAdminVendorRepository } from '../../core/interface/repositorie/admin/Iadmin.vendor.repository.js';
import { AdminVendorRepository } from '../../repositories/admin/admin.vendor.repository.js';
import { IAdminVendorService } from '../../core/interface/serivice/admin/IAdmin.vendor.service.js';
import { AdminVendorService } from '../../services/admin/admin.vendor.service.js';
import { IAdminSubscriptionController } from '../../core/interface/controllerInterface/admin/Iadmin.subscription.controller.js';
import { AdminSubscriptionController } from '../../controllers/adminController/admin.subscription.controller.js';
import { IAdminSubscriptionService } from '../../core/interface/serivice/admin/IAdmin.subscription.service.js';
import { AdminSubscriptionService } from '../../services/admin/admin.subscription.service.js';
import { IAdminCouponController } from '../../core/interface/controllerInterface/admin/Iadmin.coupon.controller.js';
import { AdminCouponController } from '../../controllers/adminController/admin.coupon.controller.js';
import { IAdminCouponService } from '../../core/interface/serivice/admin/IAdmin.coupon.service.js';
import { AdminCouponService } from '../../services/admin/admin.coupon.service.js';
import { IAdminCouponRepository } from '../../core/interface/repositorie/admin/Iadmin.coupon.repository.js';
import { AdminCouponRepository } from '../../repositories/admin/admin.coupon.repository.js';

// ----------------------------------------------------agency----------------------------------------------------------------------
import { IAgencyAuthController } from '../../core/interface/controllerInterface/agency/agency.Iauth.controller.js';
import { AgencyAuthController } from '../../controllers/agencyController/agency.auth.controller.js';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { agencyRepository } from '../../repositories/agency/agency.auth.repository.js';
import { IAgencyAuthService } from '../../core/interface/serivice/agency/Iagency.auth.service.js';
import { agencyAuthService } from '../../services/agency/agency.auth.service.js';
import { IAgencyProfileController } from '../../core/interface/controllerInterface/agency/Iagency.profile.controller.js';
import { AgencyProfileController } from '../../controllers/agencyController/agency.profile.controller.js';
import { IAgencyProfileService } from '../../core/interface/serivice/agency/Iagenc.profile.service.js';
import { AgencyProfileService } from '../../services/agency/agency.profile.service.js';
import { IAgencyPackageController } from '../../core/interface/controllerInterface/agency/Iagencu.package.controller.js';
import { agencyPackageController } from '../../controllers/agencyController/agency.package.controller.js';
import { IAgencyPackageService } from '../../core/interface/serivice/agency/Iagency.package.service.js';
import { AgencyPackageService } from '../../services/agency/agency.package.service.js';
import { IAgencyPackageRepository } from '../../core/interface/repositorie/agency/Iagency.package.repository.js';
import { AgencyPackageRepository } from '../../repositories/agency/agency.package.repository.js';

// ------------------------------------------------------Hotel------------------------------------------------------------------------
import { IHotelAuthController } from '../../core/interface/controllerInterface/hotel/Ihotel.auth.controller.js';
import { HotelAuthController } from '../../controllers/hotelController/hotel.auth.controller.js';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { HotelAuthRepository } from '../../repositories/hotel/hotel.auth.repository.js';
import { IHotelAuthService } from '../../core/interface/serivice/hotel/Ihotel.auth.service.js';
import { HotelAuthService } from '../../services/hotel/hotel.auth.service.js';
import { IHotelProfileController } from '../../core/interface/controllerInterface/hotel/Ihotel.profile.controller.js';
import { HotelProfileCotroller } from '../../controllers/hotelController/hote.profile.controller.js';
import { IHotelProfileService } from '../../core/interface/serivice/hotel/Ihotel.profile.service.js';
import { HotelProfileService } from '../../services/hotel/hotel.profile.service.js';
import { IHotelRoomsController } from '../../core/interface/controllerInterface/hotel/Ihotel.rooms.controller.js';
import { HotelRoomsController } from '../../controllers/hotelController/hotel.rooms.controller.js';
import { IHotelRoomsService } from '../../core/interface/serivice/hotel/Ihotel.rooms.service.js';
import { HotelRoomsService } from '../../services/hotel/hotel.rooms.service.js';
import { IHotelRoomsRepository } from '../../core/interface/repositorie/Hotel/Ihotel.rooms.repository.js';
import { HotelRoomsRepository } from '../../repositories/hotel/hotel.rooms.repository.js';

// ----------------------------------------------------Restaurant------------------------------------------------------------------
import { IRestaurantAuthController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.auth.controller.js';
import { RestaurantAuthController } from '../../controllers/restaurantController/restaurant.auth.controller.js';
import { IRestaurantAuthService } from '../../core/interface/serivice/restaurant/Irestautant.auth.service.js';
import { RestaurantAuthService } from '../../services/restaurant/restaurant.auth.service.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { RestaurantAuthRepository } from '../../repositories/restaunrat/restaurant.auth.repository.js';
import { IRestaurantProfileController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.profile.controller.js';
import { RestaurantProfileController } from '../../controllers/restaurantController/restaurant.profile.controller.js';
import { IRestaurantProfileService } from '../../core/interface/serivice/restaurant/IRestaurant.profile.service.js';
import { RestaurantProfileService } from '../../services/restaurant/restaurant.profile.service.js';
import { IRestaurantFoodController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.food.controller.js';
import { RestaurantFoodController } from '../../controllers/restaurantController/restaurant.food.controller.js';
import { IRestaurantFoodService } from '../../core/interface/serivice/restaurant/Irestaurant.food.service.js';
import { RestaurantFoodService } from '../../services/restaurant/restaurant.food.service.js';
import { IRestaurantFoodRespository } from '../../core/interface/repositorie/restaurant/Irestaurant.food.repository.js';
import { RestaurantFoodRepository } from '../../repositories/restaunrat/restaurant.food.repository.js';
import { IRestaurantSubscriptionController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.subscription.controller.js';
import { RestaurantSubscriptionController } from '../../controllers/restaurantController/restaurant.subscription.controller.js';
import { IRestaurantSubscriptionService } from '../../core/interface/serivice/restaurant/Irestaurant.subscription.service.js';
import { RestaurantSubscriptionService } from '../../services/restaurant/restaurant.subscription.service.js';

const container = new Container();

// ------------------------------------------------general container-----------------------------------------------------------------
container.bind<IJWT>('IJWT').to(JWT).inSingletonScope();
container.bind<IRedisClient>('IRedisClient').to(RedisClient).inSingletonScope();
container.bind<IEmailService>('IEmailService').to(EmailService).inSingletonScope();
container.bind<IGeneralService>('IGeneralService').to(GeneralService).inSingletonScope();
container.bind<IAuthValidator>('IAuthValidator').to(authValidator);
container.bind<ISubscriptionValidator>('ISubscriptionValidator').to(SubscriptionValidator);
container.bind<ICouponValidator>('ICouponValidator').to(CouponValidator);
container.bind<IPaymentValidator>('IPaymentValidator').to(PaymentValidator)

// -------------------------------------------------------Shared container-----------------------------------------------------------
container.bind<IWalletService>('IWalletService').to(WalletService);
container.bind<ISharedWalletController>('ISharedWalletController').to(SharedWalletController);
container.bind<IWalletRespository>('IWalletRespository').to(WalletRespository);
container.bind<ISharedSubscriptionController>('ISharedSubscriptionController').to(SharedSubscriptionController);
container.bind<ISharedSubscriptionService>('ISharedSubscriptionService').to(SharedSubscriptionService);
container.bind<ISubscriptionHistoryRepository>('ISubscriptionHistoryRepository').to(subscriptionHistoryRepository)

// ---------------------------------------------------user container-------------------------------------------------------------------------
container.bind<IAuthRepository>('IAuthRepository').to(AuthRepository);
container.bind<IAuthService>('IAuthService').to(AuthService);
container.bind<IController>('IController').to(AuthController);
container.bind<IUserProfileController>('IUserProfileController').to(ProfileController);
container.bind<IUserProfileService>('IUserProfileService').to(UserProfileService);
container.bind<IUserPackageController>('IUserPackageController').to(UserPackageController);
container.bind<IUserPackageService>('IUserPackageService').to(UserPackageSerivce);
container.bind<IUserHotelsController>('IUserHotelsController').to(UserHotelsController);
container.bind<IUserHotelsService>('IUserHotelsService').to(UserHotelsService);
container.bind<IPaymentController>('IPaymentController').to(UserPaymentController);
container.bind<IPaymentUtils>('IPaymentUtils').to(PaymentUtils);
container.bind<IUserFoodsController>('IUserFoodsController').to(userFoodsController);
container.bind<IUserFoodsService>('IUserFoodsService').to(userFoodsService);

// -----------------------------------------------------admin containers----------------------------------------------------------------------
container.bind<IAdminAuthController>('IAdminAuthController').to(AdminAuthController);
container.bind<IAdminAuthService>('IAdminAuthService').to(AdminAuthService);
container.bind<IAdminVendorController>('IAdminVendorController').to(AdminVendorController);
container.bind<IAdminVendorRepository>('IAdminVendorRepository').to(AdminVendorRepository);
container.bind<IAdminVendorService>('IAdminVendorService').to(AdminVendorService);
container.bind<IAdminSubscriptionController>('IAdminSubscriptionController').to(AdminSubscriptionController);
container.bind<IAdminSubscriptionService>('IAdminSubscriptionService').to(AdminSubscriptionService);
container.bind<ISubscriptionRepository>('ISubscriptionRepository').to(SubscriptionRepository);
container.bind<IAdminCouponController>('IAdminCouponController').to(AdminCouponController);
container.bind<IAdminCouponService>('IAdminCouponService').to(AdminCouponService);
container.bind<IAdminCouponRepository>('IAdminCouponRepository').to(AdminCouponRepository)

// ------------------------------------------------------agency containers--------------------------------------------------------
container.bind<IAgencyAuthController>('IAgencyAuthController').to(AgencyAuthController);
container.bind<IAgencyRespository>('IAgencyRespository').to(agencyRepository);
container.bind<IAgencyAuthService>('IAgencyAuthService').to(agencyAuthService);
container.bind<IAgencyProfileController>('IAgencyProfileController').to(AgencyProfileController);
container.bind<IAgencyProfileService>('IAgencyProfileService').to(AgencyProfileService);
container.bind<IAgencyPackageController>('IAgencyPackageController').to(agencyPackageController);
container.bind<IAgencyPackageService>('IAgencyPackageService').to(AgencyPackageService);
container.bind<IAgencyPackageRepository>('IAgencyPackageRepository').to(AgencyPackageRepository);

// --------------------------------------------------------Hotel containers---------------------------------------------------------------
container.bind<IHotelAuthController>('IHotelAuthController').to(HotelAuthController);
container.bind<IHotelAuthRepository>('IHotelAuthRepository').to(HotelAuthRepository);
container.bind<IHotelAuthService>('IHotelAuthService').to(HotelAuthService);
container.bind<IHotelProfileController>('IHotelProfileController').to(HotelProfileCotroller);
container.bind<IHotelProfileService>('IHotelProfileService').to(HotelProfileService);
container.bind<IHotelRoomsController>('IHotelRoomsController').to(HotelRoomsController);
container.bind<IHotelRoomsService>('IHotelRoomsService').to(HotelRoomsService);
container.bind<IHotelRoomsRepository>('IHotelRoomsRepository').to(HotelRoomsRepository)

// -------------------------------------------------------Restaurant container----------------------------------------------------------
container.bind<IRestaurantAuthController>('IRestaurantAuthController').to(RestaurantAuthController);
container.bind<IRestaurantAuthRepository>('IRestaurantAuthRepository').to(RestaurantAuthRepository);
container.bind<IRestaurantAuthService>('IRestaurantAuthService').to(RestaurantAuthService);
container.bind<IRestaurantProfileController>('IRestaurantProfileController').to(RestaurantProfileController);
container.bind<IRestaurantProfileService>('IRestaurantProfileService').to(RestaurantProfileService);
container.bind<IRestaurantFoodController>('IRestaurantFoodController').to(RestaurantFoodController);
container.bind<IRestaurantFoodService>('IRestaurantFoodService').to(RestaurantFoodService);
container.bind<IRestaurantFoodRespository>('IRestaurantFoodRespository').to(RestaurantFoodRepository);
container.bind<IRestaurantSubscriptionController>('IRestaurantSubscriptionController').to(RestaurantSubscriptionController);
container.bind<IRestaurantSubscriptionService>('IRestaurantSubscriptionService').to(RestaurantSubscriptionService)

export { container };
