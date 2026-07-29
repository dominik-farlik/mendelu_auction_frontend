import api from './axios';
import type {Role} from "../types/role.ts";

export interface RoleResponse {
    name: Role;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    role: RoleResponse;
}

export interface UserUpdate {
    email: string;
    first_name: string;
    last_name: string;
    username?: string | null;
}

export const userService = {
    /**
     * Vrátí profil aktuálně přihlášeného uživatele (GET /users/me)
     */
    async getCurrentUser(): Promise<UserResponse> {
        const response = await api.get<UserResponse>("/users/me");
        return response.data;
    },

    /**
     * Upraví údaje aktuálně přihlášeného uživatele (PUT /users/me)
     */
    async updateCurrentUser(userData: UserUpdate): Promise<UserResponse> {
        const response = await api.put<UserResponse>("/users/me", userData);
        return response.data;
    },
};