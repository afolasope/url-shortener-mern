// import Cache from './config/redis.config';
import { app } from './app';

require('./db').connectToMongoDB();
// Cache.connect();

require('dotenv').config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is listening at port:${PORT}`);
});
