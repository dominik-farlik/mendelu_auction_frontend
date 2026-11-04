import api from './axios';
import type {ProductResponse} from "./productService.ts";

export interface OrganizationResponse {
    id: number;
    name: string;
    description: string;
    logo?: string | null;
}

export interface OrganizationCreate {
    name: string;
    description: string;
}

export interface OrganizationPublicResponse extends OrganizationResponse {
    total_raised: number;
    finished_auctions_count: number;
    active_auctions_count: number;
}

const buildOrganizationFormData = (organizationData: OrganizationCreate, logo: File | null) => {
    const data = new FormData();
    data.append('name', organizationData.name);
    data.append('description', organizationData.description);

    if (logo) {
        data.append('logo', logo);
    }

    return data;
};

export const organizationService = {
    /**
     * Vrátí všechny organizace.
     */
    async getAll(): Promise<OrganizationResponse[]> {
        const response = await api.get<OrganizationResponse[]>('/organizations');
        return response.data;
    },

    /**
     * Vytvoří novou organizaci.
     */
    async createOrganization(organizationData: OrganizationCreate, logo: File | null): Promise<OrganizationResponse> {
        const response = await api.post<OrganizationResponse>('/organizations', buildOrganizationFormData(organizationData, logo), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Upraví organizaci, logo se mění jen pokud je předáno.
     */
    async updateOrganization(organizationId: number, organizationData: OrganizationCreate, logo: File | null): Promise<OrganizationResponse> {
        const response = await api.put<OrganizationResponse>(`/organizations/${organizationId}`, buildOrganizationFormData(organizationData, logo), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Smaže organizaci.
     */
    async deleteOrganization(organizationId: number): Promise<void> {
        await api.delete(`/organizations/${organizationId}`);
    },

    /**
     * Vrátí veřejný profil organizace včetně statistik.
     */
    async getPublicProfile(organizationId: number): Promise<OrganizationPublicResponse> {
        const response = await api.get<OrganizationPublicResponse>(`/organizations/${organizationId}/public`);
        return response.data;
    },

    /**
     * Vrátí právě probíhající schválené aukce, jejichž výtěžek obdrží organizace.
     */
    async getOrganizationAuctions(organizationId: number): Promise<ProductResponse[]> {
        const response = await api.get<ProductResponse[]>(`/organizations/${organizationId}/products`);
        return response.data;
    },
};
