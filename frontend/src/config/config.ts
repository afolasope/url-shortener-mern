import axios from "axios";

const development = process.env.NODE_ENV == 'development';


export const config = {
    HOST : development ? 'localhost:8000' : undefined
}

export const axiosInstance = axios.create({
    baseURL: config.HOST,
});

