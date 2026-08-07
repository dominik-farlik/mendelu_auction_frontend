export const SaleType = {
    Auction: "auction",
    BuyNow: "buy_now",
    Both: "both",
} as const;

export type SaleType = typeof SaleType[keyof typeof SaleType];

export const Status = {
    Pending: "pending",
    Approved: "approved",
    Canceled: "cancelled",
} as const;

export type Status = typeof Status[keyof typeof Status];