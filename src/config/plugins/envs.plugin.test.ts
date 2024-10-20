import { envs } from './envs.plugin';

// prettier-ignore
describe('envs.plugin.ts', () => {


  test('should return env options', () => {
    expect(envs).toEqual({
      PORT: 3000,
      MAILER_EMAIL: 'ra@gmail.com',
      MAILER_SECRET_KEY: 'zohneavhbkndtyeu',
      PROD: true,
      MAILER_SERVICE: 'gmail',
      MONGO_URL: 'mongodb://raul:123456789@localhost:27019/',
      MONGO_DB_NAME: 'NOC-TEST',
      MONGO_USER: 'raul',
      MONGO_PASSWORD: '123456789',
    });
  });

  test("should return an error if a value is not in the correct type", async ()=> {
    jest.resetModules()
    process.env.PORT = "dcdc"

    try {
      await import('./envs.plugin')
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer')
    }
  })
});
