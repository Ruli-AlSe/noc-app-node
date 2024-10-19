import { CheckService } from '../domain/use-cases/checks/check.service';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { FileSystemDataSource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log.respository';
import { CronService } from './cron/cron.service';
import { EmailService } from './email/email.service';

const fileSystemLogRepository = new LogRepositoryImplementation(new FileSystemDataSource());
const emailService = new EmailService();

export class Server {
  public static start() {
    console.log('Server started...');

    // const url = 'http://localhost:3000/posts';

    // emailService.sendEmailWithFileSystemLogs(['ibyzarecidence@gmail.com']);
    new SendEmailLogs(emailService, fileSystemLogRepository).execute(['ibyzarecidence@gmail.com']);
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
