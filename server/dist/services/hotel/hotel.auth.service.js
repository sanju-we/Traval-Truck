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
exports.HotelAuthService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const resAndErrors_1 = require("../../utils/resAndErrors");
const hotel_dto_1 = require("../../core/DTO/hotel/hotel.dto");
const logger_1 = require("../../utils/logger");
let HotelAuthService = class HotelAuthService {
    constructor(_ijwt, _redisClient, _hotelRepo, _emailService, _authValidator) {
        this._ijwt = _ijwt;
        this._redisClient = _redisClient;
        this._hotelRepo = _hotelRepo;
        this._emailService = _emailService;
        this._authValidator = _authValidator;
    }
    async verifyHotel(enteredEmail, enteredOtp, hotelData) {
        await this._authValidator.signUpValidator(enteredOtp, enteredEmail, hotelData);
        const pending = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pending)
            throw new resAndErrors_1.OtpExpiredError();
        const { otp, email } = JSON.parse(pending);
        if (email !== enteredEmail || otp !== enteredOtp) {
            throw new resAndErrors_1.InvalidCredentialsError();
        }
        const existingHotel = await this._hotelRepo.findByEmail(email);
        if (existingHotel)
            throw new resAndErrors_1.EmailAlreadyRegisteredError();
        logger_1.logger.info(`otp : ${otp} otp type: ${typeof otp}, entered otp : ${enteredOtp}, type of ${typeof enteredOtp} , email : ${enteredEmail}`);
        const hashedPassword = await bcryptjs_1.default.hash(hotelData.password, 10);
        const hotelDoc = await this._hotelRepo.create({
            ownerName: hotelData.ownerName,
            companyName: hotelData.companyName,
            email: hotelData.email,
            password: hashedPassword,
            phone: hotelData.phone,
            isApproved: false,
            role: 'hotel',
        });
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: hotelDoc?.id,
            role: hotelDoc?.role,
        });
        await this._redisClient.del(`pending:${email}`);
        return { hotel: (0, hotel_dto_1.toHotelProfile)(hotelDoc), accessToken, refreshToken };
    }
    async verifyHotelLogin(email, password) {
        await this._authValidator.loginValidator(email, password);
        const existingHotel = await this._hotelRepo.findByEmail(email);
        if (!existingHotel)
            throw new resAndErrors_1.UserNotFoundError();
        const isMatch = await bcryptjs_1.default.compare(password, existingHotel.password);
        if (!isMatch)
            throw new resAndErrors_1.InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: existingHotel.id,
            role: existingHotel.role,
        });
        return { hotel: (0, hotel_dto_1.toHotelProfile)(existingHotel), accessToken, refreshToken };
    }
    async sendResetLink(email) {
        const hotelData = await this._hotelRepo.findByEmail(email);
        if (!hotelData)
            throw new resAndErrors_1.UserNotFoundError();
        const { resetLink } = await this._ijwt.generateResetToken({
            id: hotelData.id,
            email: hotelData.email,
        });
        logger_1.logger.info(`resetLink :- ${resetLink}`);
        await this._emailService.sendEmail(email, `Password Rest Link`, `Reset your password in here : ${resetLink}`);
    }
    async resetHotelPassword(newPassword, token) {
        await this._authValidator.resetPasswordValidator(token, newPassword);
        const payload = await this._ijwt.verifyResetToken(token);
        if (!payload)
            throw new resAndErrors_1.InvalidResetTokenError();
        const hotel = await this._hotelRepo.findById(payload.id);
        if (!hotel)
            throw new resAndErrors_1.UserNotFoundError();
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this._hotelRepo.updateHotelPasswordById(hotel.id, hashedPassword);
    }
};
exports.HotelAuthService = HotelAuthService;
exports.HotelAuthService = HotelAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IRedisClient')),
    __param(2, (0, inversify_1.inject)('IHotelAuthRepository')),
    __param(3, (0, inversify_1.inject)('IEmailService')),
    __param(4, (0, inversify_1.inject)('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], HotelAuthService);
