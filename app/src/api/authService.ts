import type {UserResponse} from "./userService.ts";
import api from "./axios.ts";

export interface UserCreate {
    email: string;
    first_name: string;
    last_name: string;
    username?: string | null;
    password: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export const authService = {
    /**
     * Zaregistruje nového uživatele do systému.
     *
     * @param {UserCreate} userData - Registrační údaje včetně hesla.
     * @returns {Promise<UserResponse>} Data nově vytvořeného uživatele.
     */
    async createUser(userData: UserCreate): Promise<UserResponse> {
        const response = await api.post<UserResponse>("/auth/register", userData);
        return response.data;
    },

    /**
     * Přihlásí uživatele a získá autentizační token (ukládaný přes cookies/interceptor).
     *
     * @param {UserLogin} credentials - Přihlašovací jméno (nebo email) a heslo.
     * @returns {Promise<{message: string}>} Potvrzovací zpráva o úspěšném přihlášení.
     */
    async login(credentials: UserLogin): Promise<{ message: string }> {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post("/auth/login", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    }
};