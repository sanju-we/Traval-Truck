"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantAuthService = void 0;
const inversify_1 = require("inversify");
const response_dto_1 = require("../../core/DTO/restaurant/response.dto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = __importDefault(require("zod"));
const resAndErrors_1 = require("../../utils/resAndErrors");
const logger_1 = require("../../utils/logger");
let RestaurantAuthService = class RestaurantAuthService {
    constructor(_ijwt, _redisClient, _restaurantRespo, _emailService) {
        this._ijwt = _ijwt;
        this._redisClient = _redisClient;
        this._restaurantRespo = _restaurantRespo;
        this._emailService = _emailService;
    }
    async verifyRestaurantSignup(enteredEmail, enteredOTP, restaurantData) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
            otp: zod_1.default.string().length(6),
            restaurantData: zod_1.default.object({
                ownerName: zod_1.default.string(),
                companyName: zod_1.default.string(),
                email: zod_1.default.email(),
                password: zod_1.default.string(),
                phone: zod_1.default.number(),
            }),
        });
        schema.parse({ email: enteredEmail, otp: enteredOTP, restaurantData });
        const pendings = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pendings)
            throw new resAndErrors_1.OtpExpiredError();
        const { email, otp } = JSON.parse(pendings);
        if (email !== enteredEmail || otp !== enteredOTP)
            throw new resAndErrors_1.InvalidCredentialsError();
        logger_1.logger.info(`got in here`);
        const existingRestaurant = await this._restaurantRespo.findByEmail(email);
        if (existingRestaurant)
            throw new resAndErrors_1.EmailAlreadyRegisteredError();
        const hashedPassword = await bcryptjs_1.default.hash(restaurantData.password, 10);
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
        return { restaurant: (0, response_dto_1.toRestaunrantProfile)(restaurantDoc), accessToken, refreshToken };
    }
    async verifyLogin(email, password) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
            password: zod_1.default.string().min(8),
        });
        schema.parse({ email, password });
        const existingRestaurant = await this._restaurantRespo.findByEmail(email);
        if (!existingRestaurant)
            throw new resAndErrors_1.UserNotFoundError();
        const isMatch = await bcryptjs_1.default.compare(password, existingRestaurant.password);
        if (!isMatch)
            throw new resAndErrors_1.InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: existingRestaurant.id,
            role: existingRestaurant.role,
        });
        return { restaurantData: (0, response_dto_1.toRestaunrantProfile)(existingRestaurant), accessToken, refreshToken };
    }
    async sendResetLink(email) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
        });
        schema.parse({ email });
        const restaurant = await this._restaurantRespo.findByEmail(email);
        if (!restaurant)
            throw new resAndErrors_1.UserNotFoundError();
        const { resetToken } = await this._ijwt.generateResetToken({
            id: restaurant.id,
            email: restaurant.email,
        });
        await this._emailService.sendEmail(email, `Password reset link`, `You can reset the pass word using this link ${resetToken}`);
    }
    async resetPassword(newPassword, token) {
        const schema = zod_1.default.object({
            newPassword: zod_1.default.string().min(8),
            token: zod_1.default.string(),
        });
        schema.parse({ token, newPassword });
        const payload = await this._ijwt.verifyResetToken(token);
        if (!payload)
            throw new resAndErrors_1.InvalidResetTokenError();
        const restaurant = await this._restaurantRespo.findById(payload.id);
        if (!restaurant)
            throw new resAndErrors_1.UserNotFoundError();
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this._restaurantRespo.findByIdAndUpdatePassword(restaurant.id, hashedPassword);
    }
};
exports.RestaurantAuthService = RestaurantAuthService;
exports.RestaurantAuthService = RestaurantAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IRedisClient')),
    __param(2, (0, inversify_1.inject)('IRestaurantAuthRepository')),
    __param(3, (0, inversify_1.inject)('IEmailService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RestaurantAuthService);
