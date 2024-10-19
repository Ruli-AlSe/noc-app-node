import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  constructor(private readonly logRepository: LogRepository) {}

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      const log = new LogEntity({
        message: `Email sent to ${to}`,
        level: LogSeverityLevel.low,
        origin: 'email.service.ts',
      });

      this.logRepository.saveLog(log);

      return true;
    } catch (error) {
      const log = new LogEntity({
        message: 'Email was not sent',
        level: LogSeverityLevel.high,
        origin: 'email.service.ts',
      });

      this.logRepository.saveLog(log);

      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = 'System logs';
    const htmlBody = `
    <h3>System logs - NOC app</h3>
    <p>See attached logs</p>`;
    const attachments = [
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
    ];

    return this.sendEmail({
      to,
      subject,
      htmlBody,
      attachments,
    });
  }
}
