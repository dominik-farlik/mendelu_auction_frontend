import api from './axios';

// Typy prodeje podle vašeho Enum modelu
export type SaleType = 'auction' | 'buy_now' | 'both';

// Rozhraní pro produkt
export interface Product {
    id: number;
    title: string;
    description?: string | null;
    starting_price?: number | null;
    buy_now_price?: number | null;
    cover_image?: string | null;
    sale_type: SaleType;
    starts_at: string;
    ends_at: string;
    owner_id: number;
}

// Data potřebná pro vytvoření nového produktu (bez ID, které generuje DB)
export type ProductCreateInput = Omit<Product, 'id' | 'owner_id'>;

export const productService = {
    // GET: Získání seznamu produktů
    async getProducts(): Promise<Product[]> {
        const response = await api.get<Product[]>('/products/');
        return response.data;
    },

    // POST: Vytvoření nového produktu
    async createProduct(productData: ProductCreateInput): Promise<Product> {
        const response = await api.post<Product>('/products/', productData);
        return response.data;
    }
};