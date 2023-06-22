"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Cache from './config/redis.config';
const app_1 = require("./app");
require('./db').connectToMongoDB();
// Cache.connect();
require('dotenv').config();
const PORT = process.env.PORT || 8000;
app_1.app.listen(PORT, () => {
    console.log(`server is listening at port:${PORT}`);
});
