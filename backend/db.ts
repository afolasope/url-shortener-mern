import mongoose from "mongoose";
require('dotenv').config();


const MONGODB_CONNECTION_URL = process.env.MONGODB_URL || '';

function connectToMongoDB() {
  mongoose.connect(MONGODB_CONNECTION_URL);

  mongoose.connection.on('connected', () => {
    console.log('connection successful');
  });
  mongoose.connection.on('error', (error:any) => {
    console.log('connection failed');
  });
}

module.exports = { connectToMongoDB };
