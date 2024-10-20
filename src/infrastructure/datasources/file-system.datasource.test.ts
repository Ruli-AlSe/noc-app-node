import fs from 'fs';
import path from 'path';
import { FileSystemDataSource } from './file-system.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

describe('file-system.datasource.ts', () => {
  const logPath = path.join(__dirname, '../../../logs');

  beforeEach(() => {
    fs.rmSync(logPath, { recursive: true, force: true });
  });

  test('should create the log files if they do not exist', () => {
    new FileSystemDataSource();
    const files = fs.readdirSync(logPath);

    expect(files.length).toBe(3);
  });

  test('should save a log in logs-low.log', async () => {
    const logDataSource = new FileSystemDataSource();
    const log = new LogEntity({
      message: 'test',
      level: LogSeverityLevel.low,
      origin: 'file-system.datasource.test.ts',
    });

    await logDataSource.saveLog(log);
    const lowLogs = fs.readFileSync(`${logPath}/logs-low.log`, 'utf-8');

    expect(lowLogs).toContain(JSON.stringify(log));
  });

  test('should save a log in logs-medium.log', async () => {
    const logDataSource = new FileSystemDataSource();
    const log = new LogEntity({
      message: 'test',
      level: LogSeverityLevel.medium,
      origin: 'file-system.datasource.test.ts',
    });

    await logDataSource.saveLog(log);
    const mediumLogs = fs.readFileSync(`${logPath}/logs-medium.log`, 'utf-8');

    expect(mediumLogs).toContain(JSON.stringify(log));
  });

  test('should save a log in logs-high.log', async () => {
    const logDataSource = new FileSystemDataSource();
    const log = new LogEntity({
      message: 'test',
      level: LogSeverityLevel.high,
      origin: 'file-system.datasource.test.ts',
    });

    await logDataSource.saveLog(log);
    const highLogs = fs.readFileSync(`${logPath}/logs-high.log`, 'utf-8');

    expect(highLogs).toContain(JSON.stringify(log));
  });

  test('should return all logs', async () => {
    const logDataSource = new FileSystemDataSource();
    const lLog = new LogEntity({
      message: 'test low',
      level: LogSeverityLevel.low,
      origin: 'file-system.datasource.test.ts',
    });
    const mLog = new LogEntity({
      message: 'test medium',
      level: LogSeverityLevel.medium,
      origin: 'file-system.datasource.test.ts',
    });
    const hLog = new LogEntity({
      message: 'test high',
      level: LogSeverityLevel.high,
      origin: 'file-system.datasource.test.ts',
    });

    await logDataSource.saveLog(lLog);
    await logDataSource.saveLog(mLog);
    await logDataSource.saveLog(hLog);
    const lLogs = await logDataSource.getLogs(LogSeverityLevel.low);
    const mLogs = await logDataSource.getLogs(LogSeverityLevel.medium);
    const hLogs = await logDataSource.getLogs(LogSeverityLevel.high);

    expect(lLogs).toEqual(expect.arrayContaining([lLog, mLog, hLog]));
    expect(mLogs).toEqual(expect.arrayContaining([mLog]));
    expect(hLogs).toEqual(expect.arrayContaining([hLog]));
  });

  test('should not throw an error if path exists', () => {
    new FileSystemDataSource();
    new FileSystemDataSource();

    expect(fs.existsSync(logPath)).toBeTruthy();
  });

  test('should throw an error if severity level is not implemented', async () => {
    const logDataSource = new FileSystemDataSource();
    const customSeverityLevel = 'SUPPER_CUSTOM_SEVERITY_LEVEL' as LogSeverityLevel;

    try {
      await logDataSource.getLogs(customSeverityLevel);

      expect(true).toBeFalsy();
    } catch (error) {
      const errorString = `${error}`;

      expect(error).toBeInstanceOf(Error);
      expect(errorString).toContain(`${customSeverityLevel} not implemented`);
    }
  });
});
