import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

mongoose.Promise = global.Promise;

class Connection {
  mongoServer: any;
  connection: any;
  constructor() {
    this.mongoServer = MongoMemoryServer.create();
    this.connection = null;
  }

  async connect() {
    this.mongoServer = await MongoMemoryServer.create();

    this.connection = await mongoose.connect(this.mongoServer.getUri(), {
      dbName: 'test',
    });
  }

  async disconnect() {
    await mongoose.disconnect();
    await (await this.mongoServer).stop();
  }

  async cleanup() {
    const models = Object.keys(this.connection?.models);
    const promises: any[] = [];

    models.map((model) => {
      promises.push(this.connection?.models[model].deleteMany({}));
    });

    await Promise.all(promises);
  }
}

/**
 * Create the initial database connection.
 *
 * @async
 * @return {Promise<Object>}
 */
const connect = async () => {
  const conn = new Connection();
  await conn.connect();
  return conn;
};

export { connect, Connection };
