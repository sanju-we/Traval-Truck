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
import { inject, injectable } from 'inversify';
import z from 'zod';
import bcrypt from 'bcryptjs';
import { OtpExpiredError, InvalidCredentialsError, EmailAlreadyRegisteredError, UserNotFoundError, InvalidResetTokenError, } from '../../utils/resAndErrors.js';
import { toHotelProfile } from '../../core/DTO/hotel/hotel.dto.js';
import { logger } from '../../utils/logger.js';
let HotelAuthService = class HotelAuthService {
    _ijwt;
    _redisClient;
    _hotelRepo;
    _emailService;
    constructor(_ijwt, _redisClient, _hotelRepo, _emailService) {
        this._ijwt = _ijwt;
        this._redisClient = _redisClient;
        this._hotelRepo = _hotelRepo;
        this._emailService = _emailService;
    }
    async verifyHotel(enteredEmail, enteredOtp, hotelData) {
        const schema = z.object({
            email: z
                .string()
                .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
            otp: z.string().length(6),
            hotelData: z.object({
                companyName: z.string(),
                ownerName: z.string(),
                email: z
                    .string()
                    .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                password: z.string().min(8),
                phone: z.number(),
            }),
        });
        schema.parse({ otp: enteredOtp, email: enteredEmail, hotelData });
        const pending = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pending)
            throw new OtpExpiredError();
        const { otp, email } = JSON.parse(pending);
        if (email !== enteredEmail || otp !== enteredOtp) {
            throw new InvalidCredentialsError();
        }
        const existingHotel = await this._hotelRepo.findByEmail(email);
        if (existingHotel)
            throw new EmailAlreadyRegisteredError();
        logger.info(`otp : ${otp} otp type: ${typeof otp}, entered otp : ${enteredOtp}, type of ${typeof enteredOtp} , email : ${enteredEmail}`);
        const hashedPassword = await bcrypt.hash(hotelData.password, 10);
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
        return { hotel: toHotelProfile(hotelDoc), accessToken, refreshToken };
    }
    async verifyHotelLogin(email, password) {
        const schema = z.object({
            email: z
                .string()
                .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
            password: z.string().min(8),
        });
        schema.parse({ email, password });
        const existingHotel = await this._hotelRepo.findByEmail(email);
        if (!existingHotel)
            throw new UserNotFoundError();
        const isMatch = await bcrypt.compare(password, existingHotel.password);
        if (!isMatch)
            throw new InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: existingHotel.id,
            role: existingHotel.role,
        });
        return { hotel: toHotelProfile(existingHotel), accessToken, refreshToken };
    }
    async sendResetLink(email) {
        const schema = z.object({
            email: z
                .string()
                .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        });
        const hotelData = await this._hotelRepo.findByEmail(email);
        if (!hotelData)
            throw new UserNotFoundError();
        const { resetLink } = await this._ijwt.generateResetToken({
            id: hotelData.id,
            email: hotelData.email,
        });
        await this._emailService.sendEmail(email, `Password Rest Link`, `Reset your password in here : ${resetLink}`);
    }
    async resetHotelPassword(newPassword, token) {
        const schema = z.object({
            newPassword: z.string().min(8),
            token: z.string(),
        });
        schema.parse({ newPassword, token });
        const payload = await this._ijwt.verifyResetToken(token);
        if (!payload)
            throw new InvalidResetTokenError();
        const hotel = await this._hotelRepo.findById(payload.id);
        if (!hotel)
            throw new UserNotFoundError();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this._hotelRepo.updateHotelPasswordById(hotel.id, hashedPassword);
    }
};
HotelAuthService = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IRedisClient')),
    __param(2, inject('IHotelAuthRepository')),
    __param(3, inject('IEmailService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], HotelAuthService);
export { HotelAuthService };
