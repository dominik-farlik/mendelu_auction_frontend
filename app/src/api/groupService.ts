import api from './axios';

export interface GroupCreate {
    name: string;
    organization?: string | null;
}

export interface GroupResponse {
    id: number;
    name: string;
    organization?: string | null;
    manager_id: number;
    created_at: string;
}

export const userService = {
    /**
     * Vrátí skupiny aktuálně přihlášeného uživatele
     */
    async getCurrentUserGroups(): Promise<GroupResponse> {
        const response = await api.get<GroupResponse>("/groups/my");
        return response.data;
    },

    /**
     * Vytvoří novou skupinu
     */
    async createGroup(groupData: GroupCreate): Promise<GroupResponse> {
        const response = await api.post<GroupResponse>("/groups", groupData);
        return response.data;
    },
};