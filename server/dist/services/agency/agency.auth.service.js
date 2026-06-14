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
exports.agencyAuthService = void 0;
const logger_1 = require("../../utils/logger");
const inversify_1 = require("inversify");
const agency_profile_1 = require("../../core/DTO/agency/response/agency.profile");
const resAndErrors_1 = require("../../utils/resAndErrors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let agencyAuthService = class agencyAuthService {
    constructor(_redisClient, _agencyRepository, _ijwt, _emailService, _authValidator) {
        this._redisClient = _redisClient;
        this._agencyRepository = _agencyRepository;
        this._ijwt = _ijwt;
        this._emailService = _emailService;
        this._authValidator = _authValidator;
    }
    async verifyAgencySignup(enteredEmail, enteredOtp, agencyData) {
        await this._authValidator.signUpValidator(enteredEmail, enteredOtp, agencyData);
        const pending = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pending)
            throw new resAndErrors_1.OtpExpiredError();
        const { otp, email } = JSON.parse(pending);
        if (otp !== enteredOtp || email !== enteredEmail)
            throw new resAndErrors_1.InvalidOtpError();
        const existingAgency = await this._agencyRepository.findByEmail(email);
        if (existingAgency)
            throw new resAndErrors_1.EmailAlreadyRegisteredError();
        const hashedPassword = await bcryptjs_1.default.hash(agencyData.password, 10);
        const agencyDoc = await this._agencyRepository.create({
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
        logger_1.logger.info(`${agencyDoc.companyName} ragistered successfully`);
        return { agencyData: (0, agency_profile_1.toAgencyProfileDTO)(agencyDoc), accessToken, refreshToken };
    }
    async verifyAgencyLogin(email, password) {
        await this._authValidator.loginValidator(email, password);
        const agency = await this._agencyRepository.findByEmail(email);
        if (!agency)
            throw new resAndErrors_1.UserNotFoundError();
        const match = await bcryptjs_1.default.compare(password, agency.password);
        if (!match)
            throw new resAndErrors_1.InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: agency.id,
            role: agency.role,
        });
        return { agencyData: (0, agency_profile_1.toAgencyProfileDTO)(agency), accessToken, refreshToken };
    }
    async sendAgencyResetLink(email) {
        await this._authValidator.emailValidator(email);
        const agencyData = await this._agencyRepository.findByEmail(email);
        if (!agencyData)
            throw new resAndErrors_1.UserNotFoundError();
        const agency = { id: agencyData.id, email: agencyData.email, role: agencyData.role };
        const { resetLink } = await this._ijwt.generateResetToken(agency);
        await this._emailService.sendEmail(email, 'Password Reset', `Reset your password: ${resetLink}`);
        logger_1.logger.info(`From agencyAuth->sendLink:- Password reset link sent to ${email}`);
    }
    async resetPassword(token, newPassword) {
        await this._authValidator.resetPasswordValidator(token, newPassword);
        const payload = await this._ijwt.verifyResetToken(token);
        const agency = await this._agencyRepository.findById(payload.id);
        if (!agency)
            throw new resAndErrors_1.UserNotFoundError();
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this._agencyRepository.updateAgencyPasswordById(payload.id, hashedPassword);
        logger_1.logger.info(`${agency.companyName} password updated`);
        return;
    }
    async updatepartner(id, partnerId) {
        const agency = await this._agencyRepository.findById(id);
        if (!agency)
            throw new resAndErrors_1.UserNotFoundError();
        agency.partners.push(partnerId);
        const done = await agency.save();
        if (done)
            return true;
        else
            return false;
    }
};
exports.agencyAuthService = agencyAuthService;
exports.agencyAuthService = agencyAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRedisClient')),
    __param(1, (0, inversify_1.inject)('IAgencyRespository')),
    __param(2, (0, inversify_1.inject)('IJWT')),
    __param(3, (0, inversify_1.inject)('IEmailService')),
    __param(4, (0, inversify_1.inject)('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], agencyAuthService);
