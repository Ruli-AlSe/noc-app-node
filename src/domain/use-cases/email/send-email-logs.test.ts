import { LogSeverityLevel } from '../../entities/log.entity';
import { SendEmailLogs } from './send-email-logs';

// prettier-ignore
describe('send-email-logs.ts', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEmailService = {
    sendEmailWithFileSystemLogs: jest.fn().mockResolvedValue(true),
  };
  const mockLogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn()
  };

  const sendEmailLogs = new SendEmailLogs(mockEmailService as any, mockLogRepository);

  test('should call sendEmail and saveLog', async () => {

    const result = await sendEmailLogs.execute('test@test.com');

    expect(result).toBe(true);
    expect(mockLogRepository.saveLog).toHaveBeenCalled();
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(1);
  })

  test('should log in case of error', async () => {
    mockEmailService.sendEmailWithFileSystemLogs = jest.fn().mockRejectedValue(false);

    const result = await sendEmailLogs.execute('test@test.com');

    expect(result).toBe(false);
    expect(mockEmailService.sendEmailWithFileSystemLogs).toHaveBeenCalledTimes(1);
    expect(mockLogRepository.saveLog).toHaveBeenCalled();
    expect(mockLogRepository.saveLog).toBeCalledWith({
      level: LogSeverityLevel.high,
      message: 'false',
      origin: 'send-email-logs.ts',
      createdAt: expect.any(Date),
    });
  })
});
