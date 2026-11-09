import type {ProductResponse} from "../api/productService.ts";

export const Status = {
    Pending: "pending",
    Approved: "approved",
    Canceled: "cancelled",
    Finished: "finished",
} as const;

export type Status = typeof Status[keyof typeof Status];

export const Category = {
    AutoMoto: "Auto-moto",
    TravelAndAccommodation: "Cestování a pobyty",
    Electronics: "Elektronika",
    MusicAndMovie: "Hudba a film",
    Food: "Jídlo",
    Merch: "Merch",
    Fashion: "Móda",
    Services: "SluŽby",
    Sport: "Sport",
    Art: "Umění",
    Fun: "Zábava",
    Experience: "Zážitky",
    Other: "Jiné"
}

export type Category = typeof Category[keyof typeof Category];


export interface ProductWinResponse {
    order_id: number;
    amount: number;
    status: 'pending' | 'paid' | 'expired' | 'cancelled';
    expires_at: string;
    product: ProductResponse;
}
/** Nejvyšší povolený příhoz. Musí odpovídat MAX_BID_AMOUNT v backendu (models/bid.py). */
export const MAX_BID_AMOUNT = 1_000_000;

/** Nejvyšší povolená cena (počáteční, minimální příhoz, Kup teď). Musí odpovídat MAX_PRICE v backendu (models/product.py). */
export const MAX_PRICE = 100_000;

/** Vrátí chybovou hlášku, pokud některá z cen přesahuje MAX_PRICE, jinak null. */
export function priceLimitError(prices: { starting_price?: unknown; min_bid?: unknown; buy_now_price?: unknown }): string | null {
    const labels = { starting_price: "Počáteční cena", min_bid: "Minimální příhoz", buy_now_price: "Cena Kup teď" } as const;
    for (const key of Object.keys(labels) as (keyof typeof labels)[]) {
        const value = Number(prices[key]);
        if (prices[key] !== "" && prices[key] != null && value > MAX_PRICE) {
            return `${labels[key]} může být nejvýše ${MAX_PRICE.toLocaleString("cs-CZ")} Kč.`;
        }
    }
    return null;
}
