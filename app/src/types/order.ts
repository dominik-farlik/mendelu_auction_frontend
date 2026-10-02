import type {ProductResponse} from "../api/productService.ts";

export interface OrderDetailResponse {
    order_id: number;
    amount: number;
    status: "pending" | "paid" | "expired" | "cancelled" | "processing";
    expires_at: string;
    product: ProductResponse
    bank_account: string;
    variable_symbol: string
}