import axios, { AxiosError } from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Volitelný interceptor: Globální odchytávání chyb (např. vypršená session / 401)
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            // Zde můžete uživatele např. přesměrovat na přihlášení
            console.warn('Neautorizovaný přístup, relace možná vypršela.');
        }
        return Promise.reject(error);
    }
);

export default api;