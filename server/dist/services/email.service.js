var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
let EmailService = class EmailService {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.example.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    async sendEmail(to, subject, text) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || 'no-reply@example.com',
                to,
                subject,
                text,
            });
            logger.info(`Email sent to ${to}`);
        }
        catch (err) {
            logger.error(`Failed to send email: ${err.message}`);
            throw new Error('Failed to send email');
        }
    }
    async otpSend(email, otp) {
        try {
            logger.info(`Your OTP is ${otp}`);
            await this.sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
            logger.info(`OTP email sent to ${email}`);
        }
        catch (err) {
            logger.error(`Failed to send OTP: ${err.message}`);
            throw new Error('Failed to send OTP');
        }
    }
};
EmailService = __decorate([
    injectable()
], EmailService);
export { EmailService };
