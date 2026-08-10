import AuctionContainer from "../../auction/AuctionContainer.tsx";
import { useEffect, useState } from "react";
import { type ProductResponse } from "../../../api/productService.ts";
import { userService } from "../../../api/userService.ts";
import toast from "react-hot-toast";

export default function BidFollowAuctions() {
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);
    const [activeTab, setActiveTab] = useState<'followed' | 'bidded'>('followed');

    useEffect(() => {
        setAuctions([]);

        const toastId = toast.loading(
            activeTab === 'followed' ? "Načítám sledované aukce..." : "Načítám vaše příhozy..."
        );

        const fetchPromise = activeTab === 'followed'
            ? userService.getFollowedProducts()
            : userService.getBiddedProducts();

        fetchPromise
            .then((data) => {
                setAuctions(data);
                toast.dismiss(toastId);
            })
            .catch((error) => {
                console.error(`Chyba při načítání ${activeTab} aukcí:`, error);
                toast.error("Nepodařilo se načíst data", { id: toastId });
            });
    }, [activeTab]);

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300">

            <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('followed')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeTab === 'followed'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Sledované aukce
                </button>
                <button
                    onClick={() => setActiveTab('bidded')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeTab === 'bidded'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Moje příhozy
                </button>
            </div>

            { auctions.length > 0 ? (
                    <AuctionContainer auctions={auctions} cols={[1, 2, 2]} />
                ) : (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <span className="text-slate-500 font-medium">
                            {activeTab === 'followed'
                                ? "Zatím nesledujete žádné aukce."
                                : "Zatím jste se nezúčastnili žádné aukce."}
                        </span>
                    </div>
            )}
        </div>
    );
}