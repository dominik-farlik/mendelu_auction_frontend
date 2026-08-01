import api from './axios';
import type {Role} from "../types/user.ts";

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

export interface UserUpdate {
    email: string;
    first_name: string;
    last_name: string;
    username?: string | null;
}

export interface ManagerResponse {
    id: number;
    first_name: string;
    last_name: string;
}

export const userService = {
    async getCurrentUser(): Promise<UserResponse> {
        const response = await api.get<UserResponse>("/users/me");
        return response.data;
    },

    async updateCurrentUser(userData: UserUpdate): Promise<UserResponse> {
        const response = await api.put<UserResponse>("/users/me", userData);
        return response.data;
    },

    async createUser(userData: UserCreate): Promise<UserResponse> {
        const response = await api.post<UserResponse>("/auth/register", userData);
        return response.data;
    },

    async login(credentials: UserLogin): Promise<{message: string}> {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post("/auth/login", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },
};