// --------------------------------------------------general----------------------------------------------------------------
import { Container } from 'inversify';
import { JWT } from '../../utils/JWTtoken.js';
import { RedisClient } from '../../config/redisClient.js';
import { EmailService } from '../../services/email.service.js';
import { GeneralService } from '../../services/general.service.js';
import { AuthService } from '../../services/user/auth.service.js';
import { AuthRepository } from '../../repositories/user/auth.repository.js';
import { AuthController } from '../../controllers/userController/user.auth.controller.js';
import { ProfileController } from '../../controllers/userController/user.profile.controller.js';
import { UserProfileService } from '../../services/user/user.profile.service.js';
import { AdminAuthService } from '../../services/admin/admin.auth.service.js';
import { AdminAuthController } from '../../controllers/adminController/admin.auth.controller.js';
import { AdminVendorController } from '../../controllers/adminController/admin.vendor.controller.js';
import { AdminVendorRepository } from '../../repositories/admin/admin.vendor.repository.js';
import { AdminVendorService } from '../../services/admin/admin.vendor.service.js';
import { AdminSubscriptionController } from '../../controllers/adminController/admin.subscription.controller.js';
import { AdminSubscriptionService } from '../../services/admin/admin.subscription.service.js';
import { AdminSubscriptionRepository } from '../../repositories/admin/admin.subscription.repository.js';
import { AgencyAuthController } from '../../controllers/agencyController/agency.auth.controller.js';
import { agencyRepository } from '../../repositories/agency/agency.auth.repository.js';
import { agencyAuthService } from '../../services/agency/agency.auth.service.js';
import { AgencyProfileController } from '../../controllers/agencyController/agency.profile.controller.js';
import { AgencyProfileService } from '../../services/agency/agency.profile.service.js';
import { AgencyPartnerController } from '../../controllers/agencyController/agency.partner.controller.js';
import { AgencyPartnerRepository } from '../../repositories/agency/agency.partner.repository.js';
import { AgencyPartnerService } from '../../services/agency/agency.partner.service.js';
import { HotelAuthController } from '../../controllers/hotelController/hotel.auth.controller.js';
import { HotelAuthRepository } from '../../repositories/hotel/hotel.auth.repository.js';
import { HotelAuthService } from '../../services/hotel/hotel.auth.service.js';
import { HotelProfileCotroller } from '../../controllers/hotelController/hote.profile.controller.js';
import { HotelProfileService } from '../../services/hotel/hotel.profile.service.js';
import { RestaurantAuthController } from '../../controllers/restaurantController/restaurant.auth.controller.js';
import { RestaurantAuthService } from '../../services/restaurant/restaurant.auth.service.js';
import { RestaurantAuthRepository } from '../../repositories/restaunrat/restaurant.auth.repository.js';
import { RestaurantProfileController } from '../../controllers/restaurantController/restaurant.profile.controller.js';
import { RestaurantProfileService } from '../../services/restaurant/restaurant.profile.service.js';
const container = new Container();
// ------------------------------------------------general container-----------------------------------------------------------------
container.bind('IJWT').to(JWT).inSingletonScope();
container.bind('IRedisClient').to(RedisClient).inSingletonScope();
container.bind('IEmailService').to(EmailService).inSingletonScope();
container.bind('IGeneralService').to(GeneralService).inSingletonScope();
// ---------------------------------------------------user container-------------------------------------------------------------------------
container.bind('IAuthRepository').to(AuthRepository);
container.bind('IAuthService').to(AuthService);
container.bind('IController').to(AuthController);
container.bind('IUserProfileController').to(ProfileController);
container.bind('IUserProfileService').to(UserProfileService);
// -----------------------------------------------------admin containers----------------------------------------------------------------------
container.bind('IAdminAuthController').to(AdminAuthController);
container.bind('IAdminAuthService').to(AdminAuthService);
container.bind('IAdminVendorController').to(AdminVendorController);
container.bind('IAdminVendorRepository').to(AdminVendorRepository);
container.bind('IAdminVendorService').to(AdminVendorService);
container
    .bind('IAdminSubscriptionController')
    .to(AdminSubscriptionController);
container.bind('IAdminSubscriptionService').to(AdminSubscriptionService);
container
    .bind('IAdminSubscriptionRepository')
    .to(AdminSubscriptionRepository);
// ------------------------------------------------------agency containers--------------------------------------------------------
container.bind('IAgencyAuthController').to(AgencyAuthController);
container.bind('IAgencyRespository').to(agencyRepository);
container.bind('IAgencyAuthService').to(agencyAuthService);
container.bind('IAgencyProfileController').to(AgencyProfileController);
container.bind('IAgencyProfileService').to(AgencyProfileService);
container.bind('IAgencyPartnerController').to(AgencyPartnerController);
container.bind('IAgencyPartnerRepository').to(AgencyPartnerRepository);
container.bind('IAgencyPartnerService').to(AgencyPartnerService);
// --------------------------------------------------------Hotel containers---------------------------------------------------------------
container.bind('IHotelAuthController').to(HotelAuthController);
container.bind('IHotelAuthRepository').to(HotelAuthRepository);
container.bind('IHotelAuthService').to(HotelAuthService);
container.bind('IHotelProfileController').to(HotelProfileCotroller);
container.bind('IHotelProfileService').to(HotelProfileService);
// -------------------------------------------------------Restaurant container----------------------------------------------------------
container.bind('IRestaurantAuthController').to(RestaurantAuthController);
container.bind('IRestaurantAuthRepository').to(RestaurantAuthRepository);
container.bind('IRestaurantAuthService').to(RestaurantAuthService);
container
    .bind('IRestaurantProfileController')
    .to(RestaurantProfileController);
container.bind('IRestaurantProfileService').to(RestaurantProfileService);
export { container };
