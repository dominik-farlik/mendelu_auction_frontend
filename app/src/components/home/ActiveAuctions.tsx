import type { ProductResponse } from "../../api/productService.ts";
import LinkButton from "../buttons/LinkButton";
import TimerBadge from "../TimerBadge";
import FollowButton from "../buttons/FollowButton";

export default function ActiveAuctions({ auctions }: { auctions: ProductResponse[] }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12 lg:gap-16">
            <h3 className="text-2xl font-black text-slate-900 uppercase m-0 tracking-tight">
                Aktivní aukce
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {auctions.map((auction) => {
                    const hasBids = auction.bids && auction.bids.length > 0;
                    const currentPrice = hasBids
                        ? Math.max(...auction.bids.map((b: any) => b.amount || 0))
                        : auction.starting_price;

                    return (
                        <div
                            key={auction.id}
                            className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-64 overflow-hidden bg-slate-100 shrink-0">
                                {auction.cover_image ? (
                                    <img
                                        src={`${import.meta.env.VITE_IMAGES_URL}/${auction.cover_image}`}
                                        alt={auction.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full flex items-center justify-center text-slate/30 h-64 bg-slate-100">
                                        Načítání obrázku...
                                    </div>
                                    )}

                                <div className="absolute top-4 right-4 z-10">
                                    <TimerBadge endTime={auction.ends_at} />
                                </div>

                                {/* Předání parametru variant="preview" */}
                                <div className="absolute top-4 left-4 z-10">
                                    <FollowButton
                                        productId={auction.id}
                                        productIsFollowed={auction.is_followed}
                                        variant="preview"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col grow p-6">
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        {auction.group.organization} • {auction.group.name}
                                    </p>
                                    <h4 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
                                        {auction.title}
                                    </h4>
                                </div>

                                {auction.description && (
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                        {auction.description}
                                    </p>
                                )}

                                <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 font-medium">
                                            {hasBids ? "Aktuální cena" : "Vyvolávací cena"}
                                        </span>
                                        <span className="text-xl font-black text-slate-900">
                                            {currentPrice.toLocaleString('cs-CZ')} Kč
                                        </span>
                                    </div>

                                    <LinkButton
                                        title="Zobrazit"
                                        link={`/aukce/detail/${auction.id}`}
                                        size="medium"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {auctions.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 dashed">
                    <p className="text-slate-500 font-medium">Momentálně neprobíhají žádné aukce.</p>
                </div>
            )}
        </div>
    );
}