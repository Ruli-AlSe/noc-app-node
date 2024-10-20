import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { LogRepositoryImplementation } from './log.respository';

describe('log.repository.ts', () => {
  beforeEach(() => jest.clearAllMocks());

  const logDatasourceMock = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const logRepository = new LogRepositoryImplementation(logDatasourceMock);

  test('saveLog should call the datasource', async () => {
    const log = { level: LogSeverityLevel.low, message: 'test message' } as LogEntity;
    await logRepository.saveLog(log);

    expect(logDatasourceMock.saveLog).toHaveBeenCalledWith(log);
  });

  test('getLogs should call the datasource with arguments', async () => {
    await logRepository.getLogs(LogSeverityLevel.low);

    expect(logDatasourceMock.getLogs).toHaveBeenCalledWith(LogSeverityLevel.low);
  });
});
