import { useState, useMemo } from "react";
import type { ProductResponse } from "../../api/productService.ts";
import AuctionContainer from "../auction/AuctionContainer.tsx";

export default function ActiveAuctions({ auctions }: { auctions: ProductResponse[] }) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        auctions.forEach((auction) => {
            const categoryName = String(auction.category);
            counts[categoryName] = (counts[categoryName] || 0) + 1;
        });
        return counts;
    }, [auctions]);

    const filteredAuctions = useMemo(() => {
        if (selectedCategories.length === 0) {
            return auctions;
        }
        return auctions.filter((auction) =>
            selectedCategories.includes(String(auction.category))
        );
    }, [auctions, selectedCategories]);

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12 lg:gap-16">
            <h3 className="text-2xl font-black text-slate-900 uppercase m-0 tracking-tight">
                Aktivní aukce
            </h3>

            <div className="flex flex-wrap gap-3">
                {Object.entries(categoryCounts).map(([category, count]) => {
                    const isSelected = selectedCategories.includes(category);

                    return (
                        <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border-2 ${
                                isSelected
                                    ? "bg-slate-900 text-white border-slate-900" 
                                    : "bg-transparent text-slate-900 border-slate-900 hover:bg-slate-700 hover:text-white"
                            }`}
                        >
                            {category} ({count})
                        </button>
                    );
                })}
            </div>

            <AuctionContainer auctions={filteredAuctions} />

            {filteredAuctions.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 dashed">
                    <p className="text-slate-500 font-medium">Momentálně neprobíhají žádné aukce pro vybrané kategorie.</p>
                </div>
            )}
        </div>
    );
}