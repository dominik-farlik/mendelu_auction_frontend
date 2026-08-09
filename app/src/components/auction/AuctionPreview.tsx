import LinkButton from "../buttons/LinkButton.tsx";
import TimerBadge from "../TimerBadge.tsx";
import FollowButton from "../buttons/FollowButton.tsx";
import type {ProductResponse} from "../../api/productService.ts";

export default function AuctionPreview({ auction, hasBids, currentPrice }: {auction: ProductResponse, hasBids: boolean, currentPrice: number}) {

    return (
        <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">
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
    )
}