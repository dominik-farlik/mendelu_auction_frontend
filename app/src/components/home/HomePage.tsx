import MainAuctions from "./MainAuctions.tsx";
import ActiveAuctions from "./ActiveAuctions.tsx";
import Hero from "../Hero.tsx";
import Page from "../Page.tsx";
import {useEffect, useState} from "react";
import {type ProductResponse, productService} from "../../api/productService.ts";

export default function HomePage() {
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);
    const [mainAuctions, setMainAuctions] = useState<ProductResponse[]>([]);

    useEffect(() => {
        productService.getActiveAuctions()
            .then((data) => {
                setAuctions(data);

                const bigPreviews = data.filter((auction) => auction.big_preview);
                setMainAuctions(bigPreviews);
                console.log("Aukce:", bigPreviews);
            })
            .catch((error) => console.error("Chyba při načítání aukcí:", error));
    }, []);

    return (
        <Page>
            <Hero navbarTextColor="light">
                <MainAuctions auctions={mainAuctions} />
            </Hero>
            <ActiveAuctions auctions={auctions}/>
        </Page>
    )
}