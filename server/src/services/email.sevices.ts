import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { IEmailService } from '../core/interface/emailInterface/emailInterface.js';
import { logger } from '../utils/logger.js';

@injectable()
export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        to,
        subject,
        text,
      });
      logger.info(`Email sent to ${to}`);
    } catch (err:any) {
      logger.error(`Failed to send email: ${err.message}`);
      throw new Error('Failed to send email');
    }
  }
}