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