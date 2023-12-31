import  { RedisClientType, createClient } from 'redis';
// const dotenv = require('dotenv');

// dotenv.config();

// const REDIS_USERNAME = process.env.REDIS_USERNAME || 'default';
// const REDIS_PORT = process.env.REDIS_PORT || 6379;
// const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;

class Cache {
  redis: RedisClientType | null;
  constructor() {
    this.redis = null;
  }

  async connect() {
    try {
      this.redis = await createClient();

      this.redis.connect();

      this.redis.on('connect', () => {
        console.log('Redis connected');
      });

      this.redis.on('error', () => {
        console.log('Redis connection error');
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const instance = new Cache();

export default instance;
