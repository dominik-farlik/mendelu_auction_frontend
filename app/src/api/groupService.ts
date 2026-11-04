import api from './axios';
import type {ManagerResponse, UserResponse} from "./userService.ts";
import type {OrganizationResponse} from "./organizationService.ts";

export interface GroupCreate {
    name: string;
    organization_id?: number | null;
}

export interface GroupResponse {
    id: number;
    name: string;
    organization_id?: number | null;
    organization?: OrganizationResponse | null;
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
     * Změní organizaci skupiny
     */
    async updateGroupOrganization(groupId: number, organizationId: number | null): Promise<GroupResponse> {
        const response = await api.patch<GroupResponse>(`/groups/${groupId}`, { organization_id: organizationId });
        return response.data;
    },

    /**
     * Přidá člena do skupiny
     */
    async addGroupMember(groupId: number, memberData: { email: string }): Promise<{message: string}> {
        const response = await api.post<{message: string}>(`/groups/${groupId}/members`, memberData);
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