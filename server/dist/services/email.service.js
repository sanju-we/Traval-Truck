"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const inversify_1 = require("inversify");
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("../utils/logger");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.example.com',
            port: Number(process.env.EMAIL_PORT) || 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async sendEmail(to, subject, text) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || 'no-reply@example.com',
                to,
                subject,
                text,
            });
            logger_1.logger.info(`Email sent to ${to}`);
        }
        catch (err) {
            const error = err;
            logger_1.logger.error(`Failed to send email: ${error.message}`);
            throw new Error('Failed to send email');
        }
    }
    async otpSend(email, otp) {
        try {
            logger_1.logger.info(`Your OTP is ${otp}`);
            await this.sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
            logger_1.logger.info(`OTP email sent to ${email}`);
        }
        catch (err) {
            const error = err;
            logger_1.logger.error(`Failed to send OTP: ${error.message}`);
            throw new Error('Failed to send OTP');
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, inversify_1.injectable)()
], EmailService);
