import { inject, injectable } from 'inversify';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet.js';
import z from 'zod';
import bcrypt from 'bcryptjs';
import { IHotelAuthService } from '../../core/interface/serivice/hotel/Ihotel.auth.service.js';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { vendorData } from 'types/index.js';
import {
  OtpExpiredError,
  InvalidCredentialsError,
  EmailAlreadyRegisteredError,
  UserNotFoundError,
  InvalidResetTokenError,
} from '../../utils/resAndErrors.js';
import { toHotelProfile, HotelProfileDTO } from '../../core/DTO/hotel/hotel.dto.js';
import { logger } from '../../utils/logger.js';

@injectable()
export class HotelAuthService implements IHotelAuthService {
  constructor(
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IRedisClient') private readonly _redisClient: IRedisClient,
    @inject('IHotelAuthRepository') private readonly _hotelRepo: IHotelAuthRepository,
    @inject('IEmailService') private readonly _emailService: IEmailService,
  ) {}

  async verifyHotel(
    enteredEmail: string,
    enteredOtp: string,
    hotelData: vendorData,
  ): Promise<{ hotel: HotelProfileDTO; accessToken: string; refreshToken: string }> {
    const schema = z.object({
      email: z
        .string()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
      otp: z.string().length(6),
      hotelData: z.object({
        companyName: z.string(),
        ownerName: z.string(),
        email: z
          .string()
          .regex(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ),
        password: z.string().min(8),
        phone: z.number(),
      }),
    });
    schema.parse({ otp: enteredOtp, email: enteredEmail, hotelData });

    const pending = await this._redisClient.get(`pending:${enteredEmail}`);
    if (!pending) throw new OtpExpiredError();

    const { otp, email } = JSON.parse(pending) as { email: string; otp: string };
    if (email !== enteredEmail || otp !== enteredOtp) {
      throw new InvalidCredentialsError();
    }

    const existingHotel = await this._hotelRepo.findByEmail(email);
    if (existingHotel) throw new EmailAlreadyRegisteredError();
    logger.info(
      `otp : ${otp} otp type: ${typeof otp}, entered otp : ${enteredOtp}, type of ${typeof enteredOtp} , email : ${enteredEmail}`,
    );

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

  async verifyHotelLogin(
    email: string,
    password: string,
  ): Promise<{ hotel: HotelProfileDTO; accessToken: string; refreshToken: string }> {
    const schema = z.object({
      email: z
        .string()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
      password: z.string().min(8),
    });

    schema.parse({ email, password });

    const existingHotel = await this._hotelRepo.findByEmail(email);
    if (!existingHotel) throw new UserNotFoundError();

    const isMatch = await bcrypt.compare(password, existingHotel.password);
    if (!isMatch) throw new InvalidCredentialsError();

    const { accessToken, refreshToken } = await this._ijwt.generateToken({
      id: existingHotel.id,
      role: existingHotel.role,
    });
    return { hotel: toHotelProfile(existingHotel), accessToken, refreshToken };
  }

  async sendResetLink(email: string): Promise<void> {
    const hotelData = await this._hotelRepo.findByEmail(email);
    if (!hotelData) throw new UserNotFoundError();

    const { resetLink } = await this._ijwt.generateResetToken({
      id: hotelData.id,
      email: hotelData.email,
    });
    await this._emailService.sendEmail(
      email,
      `Password Rest Link`,
      `Reset your password in here : ${resetLink}`,
    );
  }

  async resetHotelPassword(newPassword: string, token: string): Promise<void> {
    const schema = z.object({
      newPassword: z.string().min(8),
      token: z.string(),
    });
    schema.parse({ newPassword, token });
    const payload = await this._ijwt.verifyResetToken(token);
    if (!payload) throw new InvalidResetTokenError();

    const hotel = await this._hotelRepo.findById(payload.id);
    if (!hotel) throw new UserNotFoundError();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._hotelRepo.updateHotelPasswordById(hotel.id, hashedPassword);
  }
}
