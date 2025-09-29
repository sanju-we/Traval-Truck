export interface IEmailService {
  sendEmail(to: string, subject: string, text: string): Promise<void>;
  otpSend(email: string, otp: string): Promise<void>;
}
