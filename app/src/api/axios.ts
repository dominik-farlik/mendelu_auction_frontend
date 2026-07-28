import axios, { AxiosError } from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            const isLoginRoute = window.location.pathname.includes('/login');
            if (!isLoginRoute) {
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;