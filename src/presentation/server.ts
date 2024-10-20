import { LogSeverityLevel } from '../domain/entities/log.entity';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service-multiple';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { FileSystemDataSource } from '../infrastructure/datasources/file-system.datasource';
import { MongoLogDatasource } from '../infrastructure/datasources/mongo-log.datasource';
import { PostgresLogDatasource } from '../infrastructure/datasources/postgres-log.datasource';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log.respository';
import { CronService } from './cron/cron.service';
import { EmailService } from './email/email.service';

const fsLogRepository = new LogRepositoryImplementation(new FileSystemDataSource());
const mongoLogRepository = new LogRepositoryImplementation(new MongoLogDatasource());
const postgreslogRepository = new LogRepositoryImplementation(new PostgresLogDatasource());
const emailService = new EmailService();

export class Server {
  public static async start() {
    console.log('Server started...');

    // const url = 'http://localhost:3000/posts';

    // emailService.sendEmailWithFileSystemLogs(['ibyzarecidence@gmail.com']);
    // new SendEmailLogs(emailService, fileSystemLogRepository).execute(['ibyzarecidence@gmail.com']);
    const url = 'http://google.com';

    CronService.createJob('*/5 * * * * *', () => {
      new CheckServiceMultiple(
        [fsLogRepository, mongoLogRepository, postgreslogRepository],
        () => console.log(`${url} is ok!`),
        (error) => console.log(error)
      ).execute(url);
    });

    // const logs = await logRepository.getLogs(LogSeverityLevel.high);
    // console.log({ logs });
  }
}
