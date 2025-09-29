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
import { logger } from '../../utils/logger.js';
import { inject, injectable } from 'inversify';
import { toAgencyProfileDTO, } from '../../core/DTO/agency/response/agency.profile.js';
import { OtpExpiredError, InvalidOtpError, EmailAlreadyRegisteredError, UserNotFoundError, InvalidCredentialsError, } from '../../utils/resAndErrors.js';
import z from 'zod';
import bcrypt from 'bcryptjs';
let agencyAuthService = class agencyAuthService {
    _redisClient;
    _agencyRepository;
    _ijwt;
    _emailService;
    constructor(_redisClient, _agencyRepository, _ijwt, _emailService) {
        this._redisClient = _redisClient;
        this._agencyRepository = _agencyRepository;
        this._ijwt = _ijwt;
        this._emailService = _emailService;
    }
    async verifyAgencySignup(enteredEmail, enteredOtp, agencyData) {
        const schema = z.object({
            email: z.string(),
            otp: z.string(),
            agencyData: z.object({
                ownerName: z.string(),
                companyName: z.string(),
                email: z.string(),
                password: z.string(),
                phone: z.number(),
            }),
        });
        schema.parse({ email: enteredEmail, otp: enteredOtp, agencyData: agencyData });
        const pending = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pending)
            throw new OtpExpiredError();
        const { otp, email } = JSON.parse(pending);
        if (otp !== enteredOtp || email !== enteredEmail)
            throw new InvalidOtpError();
        const existingAgency = await this._agencyRepository.findByEmail(email);
        if (existingAgency)
            throw new EmailAlreadyRegisteredError();
        const hashedPassword = await bcrypt.hash(agencyData.password, 10);
        const agencyDoc = await this._agencyRepository.createAgency({
            ownerName: agencyData.ownerName,
            companyName: agencyData.companyName,
            email: agencyData.email,
            password: hashedPassword,
            phone: agencyData.phone,
            isApproved: false,
            role: 'agency',
        });
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: agencyDoc.id,
            role: agencyDoc.role,
        });
        await this._redisClient.del(`pending:${email}`);
        logger.info(`${agencyDoc.companyName} ragistered successfully`);
        return { agencyData: toAgencyProfileDTO(agencyDoc), accessToken, refreshToken };
    }
    async verifyAgencyLogin(email, password) {
        const schema = z.object({
            email: z.string(),
            password: z.string(),
        });
        schema.parse({ email, password });
        const agency = await this._agencyRepository.findByEmail(email);
        if (!agency)
            throw new UserNotFoundError();
        const match = await bcrypt.compare(password, agency.password);
        if (!match)
            throw new InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: agency.id,
            role: agency.role,
        });
        return { agencyData: toAgencyProfileDTO(agency), accessToken, refreshToken };
    }
    async sendAgencyResetLink(email) {
        const schema = z.object({
            email: z.string().email(),
        });
        schema.parse({ email });
        const agencyData = await this._agencyRepository.findByEmail(email);
        if (!agencyData)
            throw new UserNotFoundError();
        let agency = { id: agencyData.id, email: agencyData.email };
        const { resetLink } = await this._ijwt.generateResetToken(agency);
        await this._emailService.sendEmail(email, 'Password Reset', `Reset your password: ${resetLink}`);
        logger.info(`From agencyAuth->sendLink:- Password reset link sent to ${email}`);
    }
    async resetPassword(token, newPassword) {
        const payload = await this._ijwt.verifyResetToken(token);
        const agency = await this._agencyRepository.fingById(payload.id);
        if (!agency)
            throw new UserNotFoundError();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this._agencyRepository.updateAgencyPasswordById(payload.id, hashedPassword);
        logger.info(`${agency.companyName} password updated`);
        return;
    }
};
agencyAuthService = __decorate([
    injectable(),
    __param(0, inject('IRedisClient')),
    __param(1, inject('IAgencyRespository')),
    __param(2, inject('IJWT')),
    __param(3, inject('IEmailService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], agencyAuthService);
export { agencyAuthService };
