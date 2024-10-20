import { LogEntity, LogSeverityLevel } from '../entities/log.entity';
import { LogDatasource } from './log.datasource';

describe('log.datasource.ts', () => {
  const newLog = new LogEntity({
    level: LogSeverityLevel.low,
    message: 'test',
    origin: 'log.datasource.test.ts',
  });

  class MockLogDatasource extends LogDatasource {
    async saveLog(log: LogEntity): Promise<void> {
      return;
    }
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return Promise.resolve([newLog]);
    }
  }

  test('should test the abstract class', async () => {
    const mockLogDatasource = new MockLogDatasource();

    expect(mockLogDatasource).toBeInstanceOf(MockLogDatasource);
    expect(mockLogDatasource).toHaveProperty('saveLog');
    expect(mockLogDatasource).toHaveProperty('getLogs');

    await mockLogDatasource.saveLog(newLog);
    const logs = await mockLogDatasource.getLogs(LogSeverityLevel.low);

    expect(logs).toHaveLength(1);
    expect(logs[0]).toBeInstanceOf(LogEntity);
  });
});
