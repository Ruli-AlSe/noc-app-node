import { LogModel } from '../../data/mongo/models/log.model';
import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class MongoDatabase implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await LogModel.create(log);

    console.log('New log saved in mongo', newLog.id);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await LogModel.find({
      level: severityLevel,
    });

    return logs.map((mongoLog) => LogEntity.fromObject(mongoLog));
  }
}
