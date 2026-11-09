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
