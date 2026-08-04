import axios, { AxiosError } from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            const isIgnoredRoute =
                currentPath.includes('/login') ||
                currentPath.includes('/register') ||
                currentPath === '/' ||
                error.config?.url?.includes('/auth/logout');

            if (!isIgnoredRoute) {
                window.location.href = '/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;