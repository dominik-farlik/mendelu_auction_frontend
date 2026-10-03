import type {ProductResponse} from "../api/productService.ts";
import type {UserResponse} from "../api/userService.ts";

export interface OrderDetailResponse {
    order_id: number;
    amount: number;
    status: "pending" | "paid" | "expired" | "cancelled" | "processing";
    expires_at: string;
    product: ProductResponse;
    buyer: UserResponse;
    delivery_method?: "pickup" | "delivery" | null;
    shipping_address?: string | null;
    bank_account: string;
    variable_symbol: string;
}