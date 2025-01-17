import { LogEntity, LogSeverityLevel } from './log.entity';

describe('log.entity.ts', () => {
  const dataObj = {
    level: LogSeverityLevel.low,
    message: 'test',
    origin: 'log.entity.test.ts',
  };

  test('should create a log entity instance', () => {
    const log = new LogEntity(dataObj);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(dataObj.message);
    expect(log.level).toBe(dataObj.level);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test('should create a log entity instance from json', () => {
    const json = `{"level":"low","message":"Service http://google.com working","createdAt":"2024-10-20T07:12:40.394Z","origin":"check.service.ts"}`;
    const log = LogEntity.fromJson(json);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe('Service http://google.com working');
    expect(log.level).toBe(`low`);
    expect(log.origin).toBe('check.service.ts');
    expect(log.createdAt).toBeInstanceOf(Date);
  });

  test('should create a log entity instance from object', () => {
    const log = LogEntity.fromObject(dataObj);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log.message).toBe(dataObj.message);
    expect(log.level).toBe(dataObj.level);
    expect(log.origin).toBe(dataObj.origin);
    expect(log.createdAt).toBeInstanceOf(Date);
  });
});
