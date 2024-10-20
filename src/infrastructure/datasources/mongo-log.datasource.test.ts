import mongoose from 'mongoose';
import { MongoLogDatasource } from './mongo-log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { LogModel } from '../../data/mongo/models/log.model';

describe('mongo-log.datasource.ts', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL!);
  });

  afterEach(async () => {
    await LogModel.deleteMany();
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  const logDatasource = new MongoLogDatasource();
  const log = new LogEntity({
    level: LogSeverityLevel.medium,
    message: 'test',
    origin: 'test',
  });

  test('should create a log', async () => {
    const logSpy = jest.spyOn(console, 'log');

    await logDatasource.saveLog(log);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('New log saved in mongo', expect.any(String));
  });

  test('should get logs', async () => {
    await logDatasource.saveLog(log);
    await logDatasource.saveLog(log);
    const logs = await logDatasource.getLogs(LogSeverityLevel.medium);

    expect(logs.length).toBe(2);
    expect(logs[0].level).toBe(LogSeverityLevel.medium);
  });
});
