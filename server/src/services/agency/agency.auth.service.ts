import { logger } from '../../utils/logger';
import { IAgencyAuthService } from '../../core/interface/serivice/agency/Iagency.auth.service';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository';
import { inject, injectable } from 'inversify';
import { vendorData } from 'types/index';
import {
  toAgencyProfileDTO,
  agencyProfileDTO,
} from '../../core/DTO/agency/response/agency.profile';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface';
import {
  OtpExpiredError,
  InvalidOtpError,
  EmailAlreadyRegisteredError,
  UserNotFoundError,
  InvalidCredentialsError,
} from '../../utils/resAndErrors';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator.js';
import bcrypt from 'bcryptjs';

@injectable()
export class agencyAuthService implements IAgencyAuthService {
  constructor(
    @inject('IRedisClient') private readonly _redisClient: IRedisClient,
    @inject('IAgencyRespository') private readonly _agencyRepository: IAgencyRespository,
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator
  ) { }

  async verifyAgencySignup(
    enteredEmail: string,
    enteredOtp: string,
    agencyData: vendorData,
  ): Promise<{ accessToken: string; refreshToken: string; agencyData: agencyProfileDTO }> {

    await this._authValidator.signUpValidator(enteredEmail,enteredOtp,agencyData);

    const pending = await this._redisClient.get(`pending:${enteredEmail}`);
    if (!pending) throw new OtpExpiredError();

    const { otp, email } = JSON.parse(pending) as { otp: string; email: string };
    if (otp !== enteredOtp || email !== enteredEmail) throw new InvalidOtpError();

    const existingAgency = await this._agencyRepository.findByEmail(email);
    if (existingAgency) throw new EmailAlreadyRegisteredError();

    const hashedPassword = await bcrypt.hash(agencyData.password, 10);

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
    logger.info(`${agencyDoc.companyName} ragistered successfully`);
    return { agencyData: toAgencyProfileDTO(agencyDoc), accessToken, refreshToken };
  }

  async verifyAgencyLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; agencyData: agencyProfileDTO }> {
    
    await this._authValidator.loginValidator( email, password );

    const agency = await this._agencyRepository.findByEmail(email);
    if (!agency) throw new UserNotFoundError();

    const match = await bcrypt.compare(password, agency.password);
    if (!match) throw new InvalidCredentialsError();

    const { accessToken, refreshToken } = await this._ijwt.generateToken({
      id: agency.id,
      role: agency.role,
    });

    return { agencyData: toAgencyProfileDTO(agency), accessToken, refreshToken };
  }

  async sendAgencyResetLink(email: string): Promise<void> {
    
    await this._authValidator.emailValidator( email );

    const agencyData = await this._agencyRepository.findByEmail(email);
    if (!agencyData) throw new UserNotFoundError();
    const agency = { id: agencyData.id, email: agencyData.email };

    const { resetLink } = await this._ijwt.generateResetToken(agency);
    await this._emailService.sendEmail(
      email,
      'Password Reset',
      `Reset your password: ${resetLink}`,
    );

    logger.info(`From agencyAuth->sendLink:- Password reset link sent to ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {

    await this._authValidator.resetPasswordValidator(token,newPassword)
    const payload = await this._ijwt.verifyResetToken(token);
    const agency = await this._agencyRepository.findById(payload.id);
    if (!agency) throw new UserNotFoundError();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._agencyRepository.updateAgencyPasswordById(payload.id, hashedPassword);

    logger.info(`${agency.companyName} password updated`);
    return;
  }

  async updatepartner(id: string, partnerId: string): Promise<boolean> {
    const agency = await this._agencyRepository.findById(id);
    if (!agency) throw new UserNotFoundError()
    agency.partners.push(partnerId)
    const done = await agency.save()
    if(done) return true
    else return false
  }
}
