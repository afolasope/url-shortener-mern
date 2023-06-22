"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
// const dotenv = require('dotenv');
// dotenv.config();
// const REDIS_USERNAME = process.env.REDIS_USERNAME || 'default';
// const REDIS_PORT = process.env.REDIS_PORT || 6379;
// const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
// const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;
class Cache {
    constructor() {
        this.redis = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.redis = yield (0, redis_1.createClient)();
                this.redis.connect();
                this.redis.on('connect', () => {
                    console.log('Redis connected');
                });
                this.redis.on('error', () => {
                    console.log('Redis connection error');
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
const instance = new Cache();
exports.default = instance;
