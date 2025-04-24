import axios from 'axios'

//Axios instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 1000,
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;