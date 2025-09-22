import { Container } from 'inversify';
import { IAuthService } from '../../core/interface/serivice/user/auth.interface.js';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import { AuthService } from '../../services/user/auth.service.js';
import { AuthRepository } from '../../repositories/auth.repository.js';
import { JWT } from '../../utils/JWTtoken.js';
import { RedisClient } from '../../config/redisClient.js';
import { EmailService } from '../../services/email.sevices.js'
import { AuthController } from '../../controllers/userController/user.Authcontroller.js';
import { ProfileController } from '../../controllers/userController/user.profileController.js';

// admin
import { IAdminAuthService } from '../../core/interface/serivice/admin/IAdmin.auth.serivice.js';
import { AdminAuthService } from '../../services/admin/admin.auth.service.js';
import { AdminAuthController } from '../../controllers/adminController/admin.auth.controller.js';


const container = new Container();

container.bind<IAuthService>('IAuthService').to(AuthService).inSingletonScope();
container.bind<IAuthRepository>('IAuthRepository').to(AuthRepository);
container.bind<IJWT>('IJWT').to(JWT).inSingletonScope();
container.bind<IRedisClient>('IRedisClient').to(RedisClient).inSingletonScope();
container.bind<IEmailService>('IEmailService').to(EmailService).inSingletonScope();
container.bind<AuthController>(AuthController).toSelf().inSingletonScope();
container.bind<ProfileController>(ProfileController).toSelf().inSingletonScope();

// admin containers
container.bind<IAdminAuthService>('IAdminAuthService').to(AdminAuthService);
container.bind<AdminAuthController>(AdminAuthController).toSelf().inSingletonScope()

export { container };