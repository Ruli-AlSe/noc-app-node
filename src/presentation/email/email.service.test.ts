import nodemailer from 'nodemailer';
import { EmailService, SendEmailOptions } from './email.service';

describe('EmailService', () => {
  const mockSendEmail = jest.fn();

  nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: mockSendEmail,
  });

  const emailService = new EmailService();

  test('should send an email', async () => {
    const options: SendEmailOptions = {
      to: 'test@test.com',
      subject: 'Test email',
      htmlBody: '<h1>Test email</h1>',
    };

    await emailService.sendEmail(options);

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: options.to,
      subject: options.subject,
      html: options.htmlBody,
      attachments: expect.any(Array),
    });
  });

  test('should send an email with attachments', async () => {
    const email = 'test@test.com';
    await emailService.sendEmailWithFileSystemLogs(email);

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: email,
      subject: 'System logs',
      html: expect.any(String),
      attachments: expect.arrayContaining([
        {
          filename: 'logs-high.log',
          path: './logs/logs-high.log',
        },
        {
          filename: 'logs-low.log',
          path: './logs/logs-low.log',
        },
        {
          filename: 'logs-medium.log',
          path: './logs/logs-medium.log',
        },
      ]),
    });
  });
});
