// --------------------------------------------------general----------------------------------------------------------------
import { Container } from 'inversify';

import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { JWT } from '../../utils/JWTtoken';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet';
import { RedisClient } from '../../config/redisClient';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface';
import { EmailService } from '../../services/email.service';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service';
import { GeneralService } from '../../services/general.service';
import { ISubscriptionRepository } from '../../core/interface/repositorie/ISubscription.respository';
import { SubscriptionRepository } from '../../repositories/subscription.repository';
import { IAuthValidator } from '../interface/validator/Iauth.validator';
import { authValidator } from '../../validators/auth.validator';
import { ISubscriptionValidator } from '../../core/interface/validator/Isubscription.validator';
import { SubscriptionValidator } from '../../validators/subscription.validator';
import { ICouponValidator } from '../../core/interface/validator/Icoupon.validator';
import { CouponValidator } from '../../validators/coupon.validator';
import { IPaymentValidator } from '../../core/interface/validator/Ipayment.validator';
import { PaymentValidator } from '../../validators/payment.validator';
import { IBaseValidator } from '../../core/interface/validator/IBasic.validator';
import { BaseValidator } from '../../validators/base.validator';
import { IGenerateTrip } from '../../core/interface/utils/Igenerate.trip';
import { TripGenerator } from '../../utils/genarateTrip';
import { IRoomValidator } from '../../core/interface/validator/Iroom.validator';
import { RoomValidator } from '../../validators/room.validator';
import { IFoodValidator } from '../../core/interface/validator/foodValidator';
import { FoodValidator } from '../../validators/food.validator';

// ------------------------------------------------------shares-------------------------------------------------------------
import { IWalletService } from '../interface/serivice/shared/IWaller.service';
import { WalletService } from '../../services/shared/wallet.service';
import { ISharedWalletController } from '../../core/interface/controllerInterface/shared/Ishared.wallet.controller';
import { SharedWalletController } from '../../controllers/sharedController/shared.wallet.controller';
import { IWalletRespository } from '../../core/interface/repositorie/shared/IWallet.repository';
import { WalletRespository } from '../../repositories/shared/wallet.repository';
import { ISharedSubscriptionController } from '../../core/interface/controllerInterface/shared/Ishared.subscription.controller';
import { SharedSubscriptionController } from '../../controllers/sharedController/subscription.controller';
import { ISharedSubscriptionService } from '../../core/interface/serivice/shared/Ishared.subscription.service';
import { SharedSubscriptionService } from '../../services/shared/shared.subscrtiption.service';
import { ISubscriptionHistoryRepository } from '../../core/interface/repositorie/shared/ISubscription.hisroty.repository';
import { subscriptionHistoryRepository } from '../../repositories/shared/subscription.history.repository';
import { IPaymentRepository } from '../../core/interface/repositorie/shared/Ishared.payment.repository';
import { PaymentRepository } from '../../repositories/shared/payments.repository';
import { IWebhookController } from '../../core/interface/controllerInterface/shared/Iwebhook.controller';
import webHook from '../../controllers/sharedController/stripe.webhook.controller';
import { IWebhookService } from '../../core/interface/serivice/shared/IWebhook.service';
import { WebhookService } from '../../services/shared/webhook.service';
import { IMindMapRepository } from '../../core/interface/repositorie/User/IMindMap.repository';
import { MindMapRepository } from '../../repositories/user/mindMap.repositoty';
import { IReviewController } from '../../core/interface/controllerInterface/shared/Ishared.review.controller';
import { ReviewController } from '../../controllers/sharedController/shared.review.controller';
import { IReviewService } from '../../core/interface/serivice/shared/Ishared.review.service';
import { ReviewService } from '../../services/shared/shared.review.service';
import { IReviewRepository } from '../../core/interface/repositorie/shared/Ishare.review.repository';
import { ReviewRepository } from '../../repositories/shared/share.review.repository';
import { IReplayRepository } from '../../core/interface/repositorie/shared/Ireplay.repository';
import { ReplayRepository } from '../../repositories/shared/shared.replay.repository';
import { ISubscriptionCleanupService } from '../../core/interface/serivice/shared/ISubscriptionCleanup.service';
import { SubscriptionCleanupService } from '../../services/shared/subscriptionCleanup.service';
import { SchedulerService } from '../../services/shared/scheduler.service';

// ----------------------------------------------------user-------------------------------------------------------------
import { IAuthService } from '../../core/interface/serivice/user/auth.interface';
import { IAuthRepository } from '../interface/repositorie/User/IAuth.Repository';
import { AuthService } from '../../services/user/auth.service';
import { AuthRepository } from '../../repositories/user/auth.repository';
import { AuthController } from '../../controllers/userController/user.auth.controller';
import { IController } from '../../core/interface/controllerInterface/user/user.Interface';
import { ProfileController } from '../../controllers/userController/user.profile.controller';
import { IUserProfileController } from '../../core/interface/controllerInterface/user/userProfile';
import { IUserProfileService } from '../../core/interface/serivice/user/Iuser.profile.service';
import { UserProfileService } from '../../services/user/user.profile.service';
import { IUserPackageController } from '../../core/interface/controllerInterface/user/Iuser.package.controller';
import { UserPackageController } from '../../controllers/userController/user.package.controller';
import { IUserPackageService } from '../../core/interface/serivice/user/IUser.package.service';
import { UserPackageSerivce } from '../../services/user/user.package.service';
import { IUserHotelsController } from '../../core/interface/controllerInterface/user/Iuser.hotels.controller';
import { UserHotelsController } from '../../controllers/userController/user.hotels.controller';
import { IUserHotelsService } from '../../core/interface/serivice/user/IUser.hotels.service';
import { UserHotelsService } from '../../services/user/user.hotels.service';
import { IPaymentController } from '../interface/controllerInterface/shared/Ishared.payment.controller';
import { UserPaymentController } from '../../controllers/sharedController/payment.controller';
import { IPaymentUtils } from '../interface/PaymentInterface/Ipayment.utils';
import { PaymentUtils } from '../../utils/Payment';
import { IUserFoodsController } from '../../core/interface/controllerInterface/user/IUser.foods.controller';
import { userFoodsController } from '../../controllers/userController/user.foods.controller';
import { IUserFoodsService } from '../../core/interface/serivice/user/IUser.foods.service';
import { userFoodsService } from '../../services/user/user.foods.service';
import { IOrdersRepository } from '../../core/interface/repositorie/User/Iorders.repository';
import { OrderRepository } from '../../repositories/user/orders.repository';
import { IUserTripController } from '../../core/interface/controllerInterface/user/IUser.trip.controller';
import { UserTripController } from '../../controllers/userController/user.trip.controller';
import { IUserTripService } from '../../core/interface/serivice/user/IUser.trips.service';
import { UserTripService } from '../../services/user/user.trip.service';
import { IUserMindMapController } from '../../core/interface/controllerInterface/user/IUser.mindMap.controller';
import { UserMindMapController } from '../../controllers/userController/user.mindMap.controller';
import { IUserMindMapService } from '../../core/interface/serivice/user/IUser.mindMap.service';
import { UserMindMapService } from '../../services/user/user.mindMap.service';

// ----------------------------------------------------admin--------------------------------------------------------------------
import { IAdminAuthService } from '../interface/serivice/admin/IAdmin.auth.service';
import { AdminAuthService } from '../../services/admin/admin.auth.service';
import { AdminAuthController } from '../../controllers/adminController/admin.auth.controller';
import { IAdminAuthController } from '../../core/interface/controllerInterface/admin/IAuth.controller';
import { IAdminVendorController } from '../../core/interface/controllerInterface/admin/Iadmin.vendor.controller';
import { AdminVendorController } from '../../controllers/adminController/admin.vendor.controller';
import { IAdminVendorRepository } from '../../core/interface/repositorie/admin/Iadmin.vendor.repository';
import { AdminVendorRepository } from '../../repositories/admin/admin.vendor.repository';
import { IAdminVendorService } from '../../core/interface/serivice/admin/IAdmin.vendor.service';
import { AdminVendorService } from '../../services/admin/admin.vendor.service';
import { IAdminSubscriptionController } from '../../core/interface/controllerInterface/admin/Iadmin.subscription.controller';
import { AdminSubscriptionController } from '../../controllers/adminController/admin.subscription.controller';
import { IAdminSubscriptionService } from '../../core/interface/serivice/admin/IAdmin.subscription.service';
import { AdminSubscriptionService } from '../../services/admin/admin.subscription.service';
import { IAdminCouponController } from '../../core/interface/controllerInterface/admin/Iadmin.coupon.controller';
import { AdminCouponController } from '../../controllers/adminController/admin.coupon.controller';
import { IAdminCouponService } from '../../core/interface/serivice/admin/IAdmin.coupon.service';
import { AdminCouponService } from '../../services/admin/admin.coupon.service';
import { IAdminCouponRepository } from '../../core/interface/repositorie/admin/Iadmin.coupon.repository';
import { AdminCouponRepository } from '../../repositories/admin/admin.coupon.repository';
import { IAdminOrderController } from '../../core/interface/controllerInterface/admin/Iadmin.orders.controller';
import { AdminOrdersController } from '../../controllers/adminController/admin.orders.controller';
import { IAdminOrderService } from '../../core/interface/serivice/admin/Iadmin.orders.service';
import { AdminOrderService } from '../../services/admin/admin.orders.service';

// ----------------------------------------------------agency----------------------------------------------------------------------
import { IAgencyAuthController } from '../../core/interface/controllerInterface/agency/agency.Iauth.controller';
import { AgencyAuthController } from '../../controllers/agencyController/agency.auth.controller';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository';
import { agencyRepository } from '../../repositories/agency/agency.auth.repository';
import { IAgencyAuthService } from '../../core/interface/serivice/agency/Iagency.auth.service';
import { agencyAuthService } from '../../services/agency/agency.auth.service';
import { IAgencyProfileController } from '../../core/interface/controllerInterface/agency/Iagency.profile.controller';
import { AgencyProfileController } from '../../controllers/agencyController/agency.profile.controller';
import { IAgencyProfileService } from '../../core/interface/serivice/agency/Iagenc.profile.service';
import { AgencyProfileService } from '../../services/agency/agency.profile.service';
import { IAgencyPackageController } from '../../core/interface/controllerInterface/agency/Iagencu.package.controller';
import { agencyPackageController } from '../../controllers/agencyController/agency.package.controller';
import { IAgencyPackageService } from '../../core/interface/serivice/agency/Iagency.package.service';
import { AgencyPackageService } from '../../services/agency/agency.package.service';
import { IAgencyPackageRepository } from '../../core/interface/repositorie/agency/Iagency.package.repository';
import { AgencyPackageRepository } from '../../repositories/agency/agency.package.repository';
import { IAgencyOrdersController } from '../../core/interface/controllerInterface/agency/Iagency.orders.controller';
import { AgencyOrdersController } from '../../controllers/agencyController/agency.orders.controller';
import { IAgencyOrderService } from '../../core/interface/serivice/agency/Iagency.orders.service';
import { AgencyOrderService } from '../../services/agency/agency.order.service';

// ------------------------------------------------------Hotel------------------------------------------------------------------------
import { IHotelAuthController } from '../../core/interface/controllerInterface/hotel/Ihotel.auth.controller';
import { HotelAuthController } from '../../controllers/hotelController/hotel.auth.controller';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository';
import { HotelAuthRepository } from '../../repositories/hotel/hotel.auth.repository';
import { IHotelAuthService } from '../../core/interface/serivice/hotel/Ihotel.auth.service';
import { HotelAuthService } from '../../services/hotel/hotel.auth.service';
import { IHotelProfileController } from '../../core/interface/controllerInterface/hotel/Ihotel.profile.controller';
import { HotelProfileCotroller } from '../../controllers/hotelController/hote.profile.controller';
import { IHotelProfileService } from '../../core/interface/serivice/hotel/Ihotel.profile.service';
import { HotelProfileService } from '../../services/hotel/hotel.profile.service';
import { IHotelRoomsController } from '../../core/interface/controllerInterface/hotel/Ihotel.rooms.controller';
import { HotelRoomsController } from '../../controllers/hotelController/hotel.rooms.controller';
import { IHotelRoomsService } from '../../core/interface/serivice/hotel/Ihotel.rooms.service';
import { HotelRoomsService } from '../../services/hotel/hotel.rooms.service';
import { IHotelRoomsRepository } from '../../core/interface/repositorie/Hotel/Ihotel.rooms.repository';
import { HotelRoomsRepository } from '../../repositories/hotel/hotel.rooms.repository';
import { IHotelOrdersController } from '../../core/interface/controllerInterface/hotel/Ihotel.orders.controller';
import { HotelOrderController } from '../../controllers/hotelController/hotel.orders.controller';
import { IHotelOrderService } from '../../core/interface/serivice/hotel/Ihotel.order.service';
import { HotelOrderService } from '../../services/hotel/hotel.order.service';

// ----------------------------------------------------Restaurant------------------------------------------------------------------
import { IRestaurantAuthController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.auth.controller';
import { RestaurantAuthController } from '../../controllers/restaurantController/restaurant.auth.controller';
import { IRestaurantAuthService } from '../../core/interface/serivice/restaurant/Irestautant.auth.service';
import { RestaurantAuthService } from '../../services/restaurant/restaurant.auth.service';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository';
import { RestaurantAuthRepository } from '../../repositories/restaunrat/restaurant.auth.repository';
import { IRestaurantProfileController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.profile.controller';
import { RestaurantProfileController } from '../../controllers/restaurantController/restaurant.profile.controller';
import { IRestaurantProfileService } from '../../core/interface/serivice/restaurant/IRestaurant.profile.service';
import { RestaurantProfileService } from '../../services/restaurant/restaurant.profile.service';
import { IRestaurantFoodController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.food.controller';
import { RestaurantFoodController } from '../../controllers/restaurantController/restaurant.food.controller';
import { IRestaurantFoodService } from '../../core/interface/serivice/restaurant/Irestaurant.food.service';
import { RestaurantFoodService } from '../../services/restaurant/restaurant.food.service';
import { IRestaurantFoodRespository } from '../../core/interface/repositorie/restaurant/Irestaurant.food.repository';
import { RestaurantFoodRepository } from '../../repositories/restaunrat/restaurant.food.repository';
import { IRestaurantSubscriptionController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.subscription.controller';
import { RestaurantSubscriptionController } from '../../controllers/restaurantController/restaurant.subscription.controller';
import { IRestaurantSubscriptionService } from '../../core/interface/serivice/restaurant/Irestaurant.subscription.service';
import { RestaurantSubscriptionService } from '../../services/restaurant/restaurant.subscription.service';

const container = new Container();

// ------------------------------------------------general container-----------------------------------------------------------------
container.bind<IJWT>('IJWT').to(JWT).inSingletonScope();
container.bind<IRedisClient>('IRedisClient').to(RedisClient).inSingletonScope();
container.bind<IEmailService>('IEmailService').to(EmailService).inSingletonScope();
container.bind<IGeneralService>('IGeneralService').to(GeneralService).inSingletonScope();
container.bind<IAuthValidator>('IAuthValidator').to(authValidator);
container.bind<ISubscriptionValidator>('ISubscriptionValidator').to(SubscriptionValidator);
container.bind<ICouponValidator>('ICouponValidator').to(CouponValidator);
container.bind<IPaymentValidator>('IPaymentValidator').to(PaymentValidator);
container.bind<IBaseValidator>('IBaseValidator').to(BaseValidator);
container.bind<IGenerateTrip>('IGenerateTrip').to(TripGenerator);
container.bind<IRoomValidator>('IRoomValidator').to(RoomValidator);
container.bind<IFoodValidator>('IFoodValidator').to(FoodValidator);

// -------------------------------------------------------Shared container-----------------------------------------------------------
container.bind<IWalletService>('IWalletService').to(WalletService);
container.bind<ISharedWalletController>('ISharedWalletController').to(SharedWalletController);
container.bind<IWalletRespository>('IWalletRespository').to(WalletRespository);
container.bind<ISharedSubscriptionController>('ISharedSubscriptionController').to(SharedSubscriptionController);
container.bind<ISharedSubscriptionService>('ISharedSubscriptionService').to(SharedSubscriptionService);
container.bind<ISubscriptionHistoryRepository>('ISubscriptionHistoryRepository').to(subscriptionHistoryRepository);
container.bind<IPaymentRepository>('IPaymentRepository').to(PaymentRepository);
container.bind<IWebhookService>('IWebhookService').to(WebhookService);
container.bind<IWebhookController>('IWebhookController').to(webHook);
container.bind<IMindMapRepository>('IMindMapRepository').to(MindMapRepository);
container.bind<IReviewController>('IReviewController').to(ReviewController);
container.bind<IReviewService>('IReviewService').to(ReviewService);
container.bind<IReviewRepository>('IReviewRepository').to(ReviewRepository);
container.bind<IReplayRepository>('IReplayRepository').to(ReplayRepository);
container.bind<ISubscriptionCleanupService>('ISubscriptionCleanupService').to(SubscriptionCleanupService).inSingletonScope();
container.bind<SchedulerService>('SchedulerService').to(SchedulerService).inSingletonScope();

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
container.bind<IOrdersRepository>('IOrdersRepository').to(OrderRepository);
container.bind<IUserTripController>('IUserTripController').to(UserTripController);
container.bind<IUserTripService>('IUserTripService').to(UserTripService);
container.bind<IUserMindMapController>('IUserMindMapController').to(UserMindMapController);
container.bind<IUserMindMapService>('IUserMindMapService').to(UserMindMapService);

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
container.bind<IAdminCouponRepository>('IAdminCouponRepository').to(AdminCouponRepository);
container.bind<IAdminOrderController>('IAdminOrderController').to(AdminOrdersController);
container.bind<IAdminOrderService>('IAdminOrderService').to(AdminOrderService);

// ------------------------------------------------------agency containers--------------------------------------------------------
container.bind<IAgencyAuthController>('IAgencyAuthController').to(AgencyAuthController);
container.bind<IAgencyRespository>('IAgencyRespository').to(agencyRepository);
container.bind<IAgencyAuthService>('IAgencyAuthService').to(agencyAuthService);
container.bind<IAgencyProfileController>('IAgencyProfileController').to(AgencyProfileController);
container.bind<IAgencyProfileService>('IAgencyProfileService').to(AgencyProfileService);
container.bind<IAgencyPackageController>('IAgencyPackageController').to(agencyPackageController);
container.bind<IAgencyPackageService>('IAgencyPackageService').to(AgencyPackageService);
container.bind<IAgencyPackageRepository>('IAgencyPackageRepository').to(AgencyPackageRepository);
container.bind<IAgencyOrdersController>('IAgencyOrdersController').to(AgencyOrdersController);
container.bind<IAgencyOrderService>('IAgencyOrderService').to(AgencyOrderService);

// --------------------------------------------------------Hotel containers---------------------------------------------------------------
container.bind<IHotelAuthController>('IHotelAuthController').to(HotelAuthController);
container.bind<IHotelAuthRepository>('IHotelAuthRepository').to(HotelAuthRepository);
container.bind<IHotelAuthService>('IHotelAuthService').to(HotelAuthService);
container.bind<IHotelProfileController>('IHotelProfileController').to(HotelProfileCotroller);
container.bind<IHotelProfileService>('IHotelProfileService').to(HotelProfileService);
container.bind<IHotelRoomsController>('IHotelRoomsController').to(HotelRoomsController);
container.bind<IHotelRoomsService>('IHotelRoomsService').to(HotelRoomsService);
container.bind<IHotelRoomsRepository>('IHotelRoomsRepository').to(HotelRoomsRepository);
container.bind<IHotelOrdersController>('IHotelOrdersController').to(HotelOrderController);
container.bind<IHotelOrderService>('IHotelOrderService').to(HotelOrderService);

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
