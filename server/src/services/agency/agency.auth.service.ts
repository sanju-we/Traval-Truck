import { logger } from '../../utils/logger.js';
import { IAgencyAuthService } from '../../core/interface/serivice/agency/Iagency.auth.service.js';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet.js';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository.js';
import { inject, injectable } from 'inversify';
import { vendorData } from 'types/index.js';
import {
  toAgencyProfileDTO,
  agencyProfileDTO,
} from '../../core/DTO/agency/response/agency.profile.js';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import {
  OtpExpiredError,
  InvalidOtpError,
  EmailAlreadyRegisteredError,
  UserNotFoundError,
  InvalidCredentialsError,
} from '../../utils/resAndErrors.js';
import z from 'zod';
import bcrypt from 'bcryptjs';

@injectable()
export class agencyAuthService implements IAgencyAuthService {
  constructor(
    @inject('IRedisClient') private readonly _redisClient: IRedisClient,
    @inject('IAgencyRespository') private readonly _agencyRepository: IAgencyRespository,
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IEmailService') private readonly _emailService: IEmailService,
  ) {}

  async verifyAgencySignup(
    enteredEmail: string,
    enteredOtp: string,
    agencyData: vendorData,
  ): Promise<{ accessToken: string; refreshToken: string; agencyData: agencyProfileDTO }> {
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
    const schema = z.object({
      email: z.string(),
      password: z.string(),
    });
    schema.parse({ email, password });

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
    const schema = z.object({
      email: z.string().email(),
    });
    schema.parse({ email });

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
    const payload = await this._ijwt.verifyResetToken(token);
    const agency = await this._agencyRepository.findById(payload.id);
    if (!agency) throw new UserNotFoundError();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._agencyRepository.updateAgencyPasswordById(payload.id, hashedPassword);

    logger.info(`${agency.companyName} password updated`);
    return;
  }
}
