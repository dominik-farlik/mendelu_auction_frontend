import api from './axios';
import type { Role } from "../types/user.ts";
import type { ProductResponse } from "./productService.ts";

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
    public_last_name: boolean;
}

export interface UserUpdate {
    email: string;
    first_name: string;
    last_name: string;
    username?: string | null;
    public_last_name: boolean;
}

export interface ManagerResponse {
    id: number;
    first_name: string;
    last_name: string;
}

export const userService = {
    /**
     * Získá profil aktuálně přihlášeného uživatele.
     *
     * @returns {Promise<UserResponse>} Data přihlášeného uživatele.
     */
    async getCurrentUser(): Promise<UserResponse> {
        const response = await api.get<UserResponse>("/users/me");
        return response.data;
    },

    /**
     * Aktualizuje údaje aktuálně přihlášeného uživatele.
     *
     * @param {UserUpdate} userData - Nové údaje uživatele (jméno, email, atd.).
     * @returns {Promise<UserResponse>} Aktualizovaná data uživatele.
     */
    async updateCurrentUser(userData: UserUpdate): Promise<UserResponse> {
        const response = await api.put<UserResponse>("/users/me", userData);
        return response.data;
    },

    /**
     * Přihodí danou částku na specifikovanou aukci (produkt).
     *
     * @param {number} productId - ID produktu (aukce), na který se přihazuje.
     * @param {number} amount - Částka příhozu.
     * @returns {Promise<{product: ProductResponse, amount: number}>} Aktualizovaný produkt a potvrzená částka.
     */
    async bid(productId: number, amount: number): Promise<{ product: ProductResponse, amount: number }> {
        const response = await api.post<{ product: ProductResponse, amount: number }>(`/users/bid/${productId}`, { "amount": amount });
        return response.data;
    },

    /**
     * Přidá produkt (aukci) do seznamu sledovaných položek uživatele (Watchlist).
     *
     * @param {number} productId - ID produktu, který chce uživatel sledovat.
     * @returns {Promise<{message: string}>} Potvrzovací zpráva o začátku sledování.
     */
    async followProduct(productId: number): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>(`users/follow/${productId}`);
        return response.data;
    },

    /**
     * Odebere produkt ze seznamu sledovaných.
     */
    async unfollowProduct(productId: number): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>(`users/follow/${productId}`);
        return response.data;
    },

    /**
     * Získá všechny produkty, které aktuálně přihlášený uživatel sleduje.
     */
    async getFollowedProducts(): Promise<ProductResponse[]> {
        const response = await api.get<ProductResponse[]>("users/followed-products");
        return response.data;
    }
};