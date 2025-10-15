var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from 'inversify';
import { toRestaunrantProfile, } from '../../core/DTO/restaurant/response.dto.js';
import bcrypt from 'bcryptjs';
import z from 'zod';
import { EmailAlreadyRegisteredError, InvalidCredentialsError, InvalidResetTokenError, OtpExpiredError, UserNotFoundError, } from '../../utils/resAndErrors.js';
import { logger } from '../../utils/logger.js';
let RestaurantAuthService = class RestaurantAuthService {
    _ijwt;
    _redisClient;
    _restaurantRespo;
    _emailService;
    constructor(_ijwt, _redisClient, _restaurantRespo, _emailService) {
        this._ijwt = _ijwt;
        this._redisClient = _redisClient;
        this._restaurantRespo = _restaurantRespo;
        this._emailService = _emailService;
    }
    async verifyRestaurantSignup(enteredEmail, enteredOTP, restaurantData) {
        const schema = z.object({
            email: z.email(),
            otp: z.string().length(6),
            restaurantData: z.object({
                ownerName: z.string(),
                companyName: z.string(),
                email: z.email(),
                password: z.string(),
                phone: z.number(),
            }),
        });
        schema.parse({ email: enteredEmail, otp: enteredOTP, restaurantData });
        const pendings = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pendings)
            throw new OtpExpiredError();
        const { email, otp } = JSON.parse(pendings);
        if (email !== enteredEmail || otp !== enteredOTP)
            throw new InvalidCredentialsError();
        logger.info(`got in here`);
        const existingRestaurant = await this._restaurantRespo.findByEmail(email);
        if (existingRestaurant)
            throw new EmailAlreadyRegisteredError();
        const hashedPassword = await bcrypt.hash(restaurantData.password, 10);
        const restaurantDoc = await this._restaurantRespo.create({
            companyName: restaurantData.companyName,
            email: restaurantData.email,
            isApproved: false,
            ownerName: restaurantData.ownerName,
            password: hashedPassword,
            phone: restaurantData.phone,
            role: 'restaurant',
        });
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: restaurantDoc.id,
            role: restaurantDoc.role,
        });
        await this._redisClient.del(`pending:${email}`);
        return { restaurant: toRestaunrantProfile(restaurantDoc), accessToken, refreshToken };
    }
    async verifyLogin(email, password) {
        const schema = z.object({
            email: z.email(),
            password: z.string().min(8),
        });
        schema.parse({ email, password });
        const existingRestaurant = await this._restaurantRespo.findByEmail(email);
        if (!existingRestaurant)
            throw new UserNotFoundError();
        const isMatch = await bcrypt.compare(password, existingRestaurant.password);
        if (!isMatch)
            throw new InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: existingRestaurant.id,
            role: existingRestaurant.role,
        });
        return { restaurantData: toRestaunrantProfile(existingRestaurant), accessToken, refreshToken };
    }
    async sendResetLink(email) {
        const schema = z.object({
            email: z.email(),
        });
        schema.parse({ email });
        const restaurant = await this._restaurantRespo.findByEmail(email);
        if (!restaurant)
            throw new UserNotFoundError();
        const { resetToken } = await this._ijwt.generateResetToken({
            id: restaurant.id,
            email: restaurant.email,
        });
        await this._emailService.sendEmail(email, `Password reset link`, `You can reset the pass word using this link ${resetToken}`);
    }
    async resetPassword(newPassword, token) {
        const schema = z.object({
            newPassword: z.string().min(8),
            token: z.string(),
        });
        schema.parse({ token, newPassword });
        const payload = await this._ijwt.verifyResetToken(token);
        if (!payload)
            throw new InvalidResetTokenError();
        const restaurant = await this._restaurantRespo.findById(payload.id);
        if (!restaurant)
            throw new UserNotFoundError();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this._restaurantRespo.findByIdAndUpdatePassword(restaurant.id, hashedPassword);
    }
};
RestaurantAuthService = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IRedisClient')),
    __param(2, inject('IRestaurantAuthRepository')),
    __param(3, inject('IEmailService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RestaurantAuthService);
export { RestaurantAuthService };
