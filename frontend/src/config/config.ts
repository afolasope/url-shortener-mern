const development = process.env.NODE_ENV == 'development';


export const config = {
    HOST : development ? 'localhost:8000' : window.location.host
}