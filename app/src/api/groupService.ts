import api from './axios';
import type {ManagerResponse, UserResponse} from "./userService.ts";

export interface GroupCreate {
    name: string;
    organization?: string | null;
}

export interface GroupResponse {
    id: number;
    name: string;
    organization?: string | null;
    members: Array<UserResponse>;
    manager: ManagerResponse;
    created_at: string;
}

export const groupService = {
    /**
     * Vrátí skupiny aktuálně přihlášeného uživatele
     */
    async getCurrentUserGroups(): Promise<Array<GroupResponse>> {
        const response = await api.get<Array<GroupResponse>>("/groups/my");
        return response.data;
    },

    /**
     * Vytvoří novou skupinu
     */
    async createGroup(groupData: GroupCreate): Promise<GroupResponse> {
        const response = await api.post<GroupResponse>("/groups", groupData);
        return response.data;
    },

    /**
     * Vrátí detail a členy skupiny podle ID
     */
    async getGroupDetail(groupId: number): Promise<GroupResponse> {
        const response = await api.get<GroupResponse>(`/groups/${groupId}`);
        return response.data;
    }
};