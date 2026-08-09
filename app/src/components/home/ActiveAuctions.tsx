import type { ProductResponse } from "../../api/productService.ts";
import AuctionContainer from "../auction/AuctionContainer.tsx";

export default function ActiveAuctions({ auctions }: { auctions: ProductResponse[] }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12 lg:gap-16">
            <h3 className="text-2xl font-black text-slate-900 uppercase m-0 tracking-tight">
                Aktivní aukce
            </h3>

            <AuctionContainer auctions={auctions}/>

            {auctions.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 dashed">
                    <p className="text-slate-500 font-medium">Momentálně neprobíhají žádné aukce.</p>
                </div>
            )}
        </div>
    );
}