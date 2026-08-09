import AuctionContainer from "../../auction/AuctionContainer.tsx";
import {useEffect, useState} from "react";
import {type ProductResponse} from "../../../api/productService.ts";
import {userService} from "../../../api/userService.ts";

export default function BidFollowAuctions() {
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);

    useEffect(() => {
        userService.getFollowedProducts()
            .then((data) => {
                setAuctions(data);
            })
            .catch((error) => console.error("Chyba při načítání aukcí:", error));
    }, []);

    return (
        <AuctionContainer auctions={auctions} cols={[1, 2, 2]} />
    )
}