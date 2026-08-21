import type {ProductResponse} from "../../api/productService.ts";
import AuctionPreview from "./AuctionPreview.tsx";

export default function AuctionContainer({ auctions, cols = [1, 2, 3] }: { auctions: ProductResponse[], cols?: [number, number, number]}){

    return (
        <div className={`grid grid-cols-${cols[0]} md:grid-cols-${cols[1]} lg:grid-cols-${cols[2]} gap-8`}>
            {auctions.map((auction) => {
                return (
                    <AuctionPreview key={auction.id} auction={auction}/>
                );
            })}
        </div>
    )
}