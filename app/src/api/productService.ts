import api from './axios';
import type {Category, SaleType, Status} from "../types/product.ts";
import type {UserResponse} from "./userService.ts";

export interface ProductImageResponse {
    filename: string;
}

export interface ProductResponse {
    id: number;
    title: string;
    description?: string;
    category: Category;
    starting_price: number;
    buy_now_price?: number;
    min_bid?: number;
    cover_image: string;
    sale_type: SaleType;
    big_preview: boolean;
    starts_at: string;
    ends_at: string;
    created_by_id: number;
    group: {id: number, name: string, organization: string};
    created_at: string;
    status: Status;
    is_followed: boolean;
    images: Array<ProductImageResponse>;
    bids: Array<ProductBids>;
}

export interface ProductCreate {
    title: string;
    description?: string | null;
    category: Category;
    starting_price: number;
    buy_now_price?: number | null;
    min_bid?: number | null;
    sale_type: SaleType;
    big_preview: boolean;
    starts_at?: string | null;
    ends_at?: string | null;
    group_id: number;
}

export interface ProductBids {
    bidder: UserResponse;
    amount: number;
    bid_time: string;
}

export const productService = {
    /**
     * Vytvoří novou nabídku
     */
    async createAuction(
        productData: ProductCreate,
        coverImage: File | null,
        additionalImages: FileList | null
    ): Promise<ProductResponse> {
        const data = new FormData();
        data.append('product_data', JSON.stringify(productData));

        if (coverImage) {
            data.append('cover_image', coverImage);
        }

        if (additionalImages) {
            for (let i = 0; i < additionalImages.length; i++) {
                data.append('additional_images', additionalImages[i]);
            }
        }

        const response = await api.post<ProductResponse>('/products/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    /**
     * Upraví nabídku
     */
    async updateAuction(
        productId: number,
        productData: ProductCreate,
        coverImage: File | null,
        additionalImages: FileList | null
    ): Promise<ProductResponse> {
        const data = new FormData();
        data.append('product_data', JSON.stringify(productData));

        if (coverImage) {
            data.append('cover_image', coverImage);
        }

        if (additionalImages) {
            for (let i = 0; i < additionalImages.length; i++) {
                data.append('additional_images', additionalImages[i]);
            }
        }

        const response = await api.put<ProductResponse>(`/products/${productId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    /**
     * Vrátí všechny aktivní nabídky
     */
    async getActiveAuctions(): Promise<Array<ProductResponse>> {
        const response = await api.get<Array<ProductResponse>>('/products/');
        return response.data;
    },

    /**
     * Vrátí seznam všech produktů pro danou skupinu.
     * @param groupId ID skupiny
     * @returns Pole produktů
     */
    async getGroupProducts(groupId: number): Promise<ProductResponse[]> {
        try {
            const response = await api.get<ProductResponse[]>(`/products/group/${groupId}/`);
            return response.data;
        } catch (error) {
            console.error(`Chyba při načítání produktů pro skupinu ${groupId}:`, error);
            throw error;
        }
    },

    /**
     * Vrátí detail produktu podle ID.
     * @param productId ID skupiny
     * @returns Pole produktů
     */
    async getProductDetail(productId: number): Promise<ProductResponse> {
        try {
            const response = await api.get<ProductResponse>(`/products/${productId}/`);
            return response.data;
        } catch (error) {
            console.error(`Chyba při načítání produktu ${productId}:`, error);
            throw error;
        }
    },

    /**
     * @param productId ID skupiny
     * @returns Pole příhozů produktu
     */
    async getProductBids(productId: number): Promise<ProductBids[]> {
        try {
            const response = await api.get<ProductBids[]>(`/products/${productId}/bids`);
            return response.data;
        } catch (error) {
            console.error(`Chyba při načítání příhozů produktu ${productId}:`, error);
            throw error;
        }
    },

    updateProductStatus: async (id: number, status: string): Promise<void> => {
        await api.patch(`/products/${id}/status`, { status });
    },

    /**
     * Přihodí danou částku na specifikovanou aukci (produkt).
     *
     * @param {number} productId - ID produktu (aukce), na který se přihazuje.
     * @param {number} amount - Částka příhozu.
     * @returns {Promise<{product: ProductResponse, amount: number}>} Aktualizovaný produkt a potvrzená částka.
     */
    async bid(productId: number, amount: number): Promise<{ product: ProductResponse, amount: number }> {
        const response = await api.post<{ product: ProductResponse, amount: number }>(`/products/bid/${productId}`, { "amount": amount });
        return response.data;
    },

    /**
     * Přidá produkt (aukci) do seznamu sledovaných položek uživatele (Watchlist).
     *
     * @param {number} productId - ID produktu, který chce uživatel sledovat.
     * @returns {Promise<{message: string}>} Potvrzovací zpráva o začátku sledování.
     */
    async followProduct(productId: number): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>(`products/follow/${productId}`);
        return response.data;
    },

    /**
     * Odebere produkt ze seznamu sledovaných.
     */
    async unfollowProduct(productId: number): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>(`products/follow/${productId}`);
        return response.data;
    },
};