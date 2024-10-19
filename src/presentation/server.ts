import { CheckService } from '../domain/use-cases/checks/check.service';
import { FileSystemDataSource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log.respository';
import { CronService } from './cron/cron.service';
import { EmailService } from './email/email.service';

const fileSystemLogRepository = new LogRepositoryImplementation(new FileSystemDataSource());

export class Server {
  public static start() {
    console.log('Server started...');

    // const url = 'http://localhost:3000/posts';
    const emailService = new EmailService();
    emailService.sendEmail({
      to: 'ibyzarecidence@gmail.com',
      subject: 'System logs',
      htmlBody: `
          <h3>System logs - NOC app</h3>
          <p>This is a test email</p>
          <p>See attached logs</p>
          `,
    });
    const url = 'http://google.com';

    CronService.createJob('*/5 * * * * *', () => {
      new CheckService(
        fileSystemLogRepository,
        () => console.log(`${url} is ok!`),
        (error) => console.log(error)
      ).execute(url);
    });
  }
}
