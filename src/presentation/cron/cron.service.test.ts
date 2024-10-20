import { CronService } from './cron.service';

describe('CronService', () => {
  const mockTick = jest.fn();

  test('should create a job', () => {
    const job = CronService.createJob('* * * * *', mockTick);

    setTimeout(() => {
      expect(mockTick).toHaveBeenCalledTimes(2);
      job.stop();
    }, 2000);
  });
});
