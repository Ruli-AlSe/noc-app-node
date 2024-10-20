import 'dotenv/config';
import { Server } from './presentation/server';
import { MongoDatabase } from './data/mongo/init';
import { envs } from './config/plugins/envs.plugin';
import { LogModel } from './data/mongo/models/log.model';
import { PrismaClient } from '@prisma/client';

(() => {
  main();
})();

async function main() {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });

  // create a record in postgresql
  // const newLog = await prisma.logModel.create({
  //   data: {
  //     message: 'This is a test log from prisma',
  //     origin: 'app.ts',
  //     level: 'HIGH',
  //   },
  // });
  // const logs = await prisma.logModel.findMany({
  //   where: {
  //     level: 'MEDIUM',
  //   },
  // });

  // console.log({ logs });

  // create a record in mongodb
  // const newLog = await LogModel.create({
  //   message: 'This is a test log from mongo',
  //   origin: 'app.ts',
  //   level: 'low',
  // });

  // await newLog.save();

  // get all records from mongodb
  // const logs = await LogModel.find();
  // console.log({ logs });

  Server.start();
}
