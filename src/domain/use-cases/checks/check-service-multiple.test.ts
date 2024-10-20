import { LogEntity } from '../../entities/log.entity';
import { CheckServiceMultiple } from './check-service-multiple';

// prettier-ignore
describe('check-service.ts', () => {
  const mockFSRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const mockMongoRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const mockPostgresRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const mockSuccessCallback = jest.fn();
  const mockErrorCallback = jest.fn();
  const checkService = new CheckServiceMultiple(
    [mockFSRepository, mockMongoRepository, mockPostgresRepository],
    mockSuccessCallback,
    mockErrorCallback
  );


  beforeEach(() => jest.clearAllMocks());


  test('should call successCallback when fetch returns true', async () => {

    const wasOk = await checkService.execute('https://google.com');

    expect(wasOk).toBe(true);
    expect(mockSuccessCallback).toHaveBeenCalled();
    expect(mockErrorCallback).not.toHaveBeenCalled();
    expect(mockFSRepository.saveLog).toBeCalledWith(expect.any(LogEntity));
    expect(mockMongoRepository.saveLog).toBeCalledWith(expect.any(LogEntity));
    expect(mockPostgresRepository.saveLog).toBeCalledWith(expect.any(LogEntity));
  });


  test('should call errorCallback when fetch returns false', async () => {
    const wasOk = await checkService.execute('https://googlesfagag.com');

    expect(wasOk).toBe(false);
    expect(mockSuccessCallback).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockFSRepository.saveLog).toBeCalledWith(expect.any(LogEntity));
    expect(mockMongoRepository.saveLog).toBeCalledWith(expect.any(LogEntity));
    expect(mockPostgresRepository.saveLog).toBeCalledWith(expect.any(LogEntity));
  });
});
