import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/", // Ensure the correct backend URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Fetch token from storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
