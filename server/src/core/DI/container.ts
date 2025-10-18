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

const container = new Container();

// ------------------------------------------------general container-----------------------------------------------------------------
container.bind<IJWT>('IJWT').to(JWT).inSingletonScope();
container.bind<IRedisClient>('IRedisClient').to(RedisClient).inSingletonScope();
container.bind<IEmailService>('IEmailService').to(EmailService).inSingletonScope();
container.bind<IGeneralService>('IGeneralService').to(GeneralService).inSingletonScope();

// ---------------------------------------------------user container-------------------------------------------------------------------------
container.bind<IAuthRepository>('IAuthRepository').to(AuthRepository);
container.bind<IAuthService>('IAuthService').to(AuthService);
container.bind<IController>('IController').to(AuthController);
container.bind<IUserProfileController>('IUserProfileController').to(ProfileController);
container.bind<IUserProfileService>('IUserProfileService').to(UserProfileService);

// -----------------------------------------------------admin containers----------------------------------------------------------------------
container.bind<IAdminAuthController>('IAdminAuthController').to(AdminAuthController);
container.bind<IAdminAuthService>('IAdminAuthService').to(AdminAuthService);
container.bind<IAdminVendorController>('IAdminVendorController').to(AdminVendorController);
container.bind<IAdminVendorRepository>('IAdminVendorRepository').to(AdminVendorRepository);
container.bind<IAdminVendorService>('IAdminVendorService').to(AdminVendorService);

// ------------------------------------------------------agency containers--------------------------------------------------------
container.bind<IAgencyAuthController>('IAgencyAuthController').to(AgencyAuthController);
container.bind<IAgencyRespository>('IAgencyRespository').to(agencyRepository);
container.bind<IAgencyAuthService>('IAgencyAuthService').to(agencyAuthService);
container.bind<IAgencyProfileController>('IAgencyProfileController').to(AgencyProfileController);
container.bind<IAgencyProfileService>('IAgencyProfileService').to(AgencyProfileService);

// --------------------------------------------------------Hotel containers---------------------------------------------------------------
container.bind<IHotelAuthController>('IHotelAuthController').to(HotelAuthController);
container.bind<IHotelAuthRepository>('IHotelAuthRepository').to(HotelAuthRepository);
container.bind<IHotelAuthService>('IHotelAuthService').to(HotelAuthService);
container.bind<IHotelProfileController>('IHotelProfileController').to(HotelProfileCotroller);
container.bind<IHotelProfileService>('IHotelProfileService').to(HotelProfileService);

// -------------------------------------------------------Restaurant container----------------------------------------------------------
container.bind<IRestaurantAuthController>('IRestaurantAuthController').to(RestaurantAuthController);
container.bind<IRestaurantAuthRepository>('IRestaurantAuthRepository').to(RestaurantAuthRepository);
container.bind<IRestaurantAuthService>('IRestaurantAuthService').to(RestaurantAuthService);
container
  .bind<IRestaurantProfileController>('IRestaurantProfileController')
  .to(RestaurantProfileController);
container.bind<IRestaurantProfileService>('IRestaurantProfileService').to(RestaurantProfileService);

export { container };
