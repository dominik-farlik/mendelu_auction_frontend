import api from './axios';

export interface OrganizationResponse {
    id: number;
    name: string;
    /** Konkrétní podporovaný subjekt (např. dítě), u některých organizací chybí. */
    beneficiary_name?: string | null;
    /** Krátký popis pro hlavní stránku a patičku. */
    short_description?: string | null;
    /** Celý popis pro stránku organizace. */
    description: string;
    logo?: string | null;
}

export interface OrganizationCreate {
    name: string;
    beneficiary_name: string;
    short_description: string;
    description: string;
}

export const SHORT_DESCRIPTION_MAX = 300;

const buildOrganizationFormData = (organizationData: OrganizationCreate, logo: File | null) => {
    const data = new FormData();
    data.append('name', organizationData.name);
    data.append('beneficiary_name', organizationData.beneficiary_name);
    data.append('short_description', organizationData.short_description);
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
     * Vrátí detail organizace (veřejná stránka organizace).
     */
    async getOrganization(organizationId: number): Promise<OrganizationResponse> {
        const response = await api.get<OrganizationResponse>(`/organizations/${organizationId}`);
        return response.data;
    },
};
