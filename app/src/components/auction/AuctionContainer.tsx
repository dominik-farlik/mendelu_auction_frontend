import type {ProductResponse} from "../../api/productService.ts";
import AuctionPreview from "./AuctionPreview.tsx";

export default function AuctionContainer({ auctions, cols = [1, 2, 3] }: { auctions: ProductResponse[], cols?: [number, number, number]}){

    return (
        <div className={`grid grid-cols-${cols[0]} md:grid-cols-${cols[1]} lg:grid-cols-${cols[2]} gap-8`}>
            {auctions.map((auction) => {
                const hasBids = auction.bids && auction.bids.length > 0;
                const currentPrice = hasBids
                    ? Math.max(...auction.bids.map((b: any) => b.amount || 0))
                    : auction.starting_price;

                return (
                    <AuctionPreview key={auction.id} auction={auction} currentPrice={currentPrice} hasBids={hasBids}/>
                );
            })}
        </div>
    )
}