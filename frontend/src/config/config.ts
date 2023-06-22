import axios from 'axios';

const development = process.env.NODE_ENV == 'development';

export const config = {
  HOST: development ? 'localhost:8000' : window.location.host,
  BASE_URL: development ? 'http://localhost:8000' : undefined,
};

export const axiosInstance = axios.create({
  baseURL: config.BASE_URL,
});
