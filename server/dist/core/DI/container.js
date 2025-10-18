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
import { AgencyAuthController } from '../../controllers/agencyController/agency.auth.controller.js';
import { agencyRepository } from '../../repositories/agency/agency.auth.repository.js';
import { agencyAuthService } from '../../services/agency/agency.auth.service.js';
import { AgencyProfileController } from '../../controllers/agencyController/agency.profile.controller.js';
import { HotelAuthController } from '../../controllers/hotelController/hotel.auth.controller.js';
import { HotelAuthRepository } from '../../repositories/hotel/hotel.auth.repository.js';
import { HotelAuthService } from '../../services/hotel/hotel.auth.service.js';
import { HotelProfileCotroller } from '../../controllers/hotelController/hote.profile.controller.js';
import { HotelProfileService } from '../../services/hotel/hotel.profile.service.js';
import { RestaurantAuthController } from '../../controllers/restaurantController/restaurant.auth.controller.js';
import { RestaurantAuthService } from '../../services/restaurant/restaurant.auth.service.js';
import { RestaurantAuthRepository } from '../../repositories/restaunrat/restaurant.auth.repository.js';
import { RestaurantProfileController } from '../../controllers/restaurantController/restaurant.profile.controller.js';
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
// ------------------------------------------------------agency containers--------------------------------------------------------
container.bind('IAgencyAuthController').to(AgencyAuthController);
container.bind('IAgencyRespository').to(agencyRepository);
container.bind('IAgencyAuthService').to(agencyAuthService);
container.bind('IAgencyProfileController').to(AgencyProfileController);
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
export { container };
