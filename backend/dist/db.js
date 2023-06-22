"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const MONGODB_CONNECTION_URL = process.env.MONGODB_URL || '';
function connectToMongoDB() {
    mongoose_1.default.connect(MONGODB_CONNECTION_URL);
    mongoose_1.default.connection.on('connected', () => {
        console.log('connection successful');
    });
    mongoose_1.default.connection.on('error', (error) => {
        console.log('connection failed');
    });
}
module.exports = { connectToMongoDB };
