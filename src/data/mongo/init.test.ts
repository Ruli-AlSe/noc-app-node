import mongoose from 'mongoose';
import { MongoDatabase } from './init';

// prettier-ignore
describe('Init MongoDB', () => {

  afterAll(()=> {
    mongoose.connection.close()
  })


  test('should connect to MongoDB', async () => {
    const connected = await MongoDatabase.connect({
      dbName: process.env.MONGO_DB_NAME!,
      mongoUrl: process.env.MONGO_URL!,
    });

    expect(connected).toBeTruthy();
  });


  test('should throw an error if no connect to MongoDB', async () => {
    try {
      await MongoDatabase.connect({
        dbName: process.env.MONGO_DB_NAME!,
        mongoUrl: '',
      });
    } catch(error) {
      expect(`${error}`).toContain('MongooseError');
    }

  });
});
