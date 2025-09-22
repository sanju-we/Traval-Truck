export interface IEmailService {
  sendEmail(to: string, subject: string, text: string): Promise<void>;
}