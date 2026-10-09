import { Link, useNavigate } from "react-router-dom";
import type { ProductResponse } from "../../api/productService.ts";
import { Status } from "../../types/product.ts";
import TimerBadge from "../TimerBadge.tsx";
import {useState} from "react";

export default function CreatedAuctions({ auctions }: { auctions: ProductResponse[] }) {
    const navigate = useNavigate();
    const [currentTime] = useState(() => Date.now());

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return { className: "bg-[#4ade80]/20 text-[#16a34a]", label: "Schváleno" };
            case "pending":
                return { className: "bg-amber-100 text-amber-700", label: "Čekající" };
            case "finished":
                return { className: "bg-[#1aedd6]/20 text-[#00c4ff]", label: "Ukončeno" };
            case "cancelled":
            case "canceled":
                return { className: "bg-red-100 text-red-700", label: "Zamítnuto" };
            default:
                return { className: "bg-slate-100 text-slate-700", label: status };
        }
    };

    const sortedAuctions = [...auctions].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
    });

    return (
        <>
            {sortedAuctions.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
                    <span className="text-slate-500 font-medium">Ve vaší skupině nebyla přidána žádná nabídka.</span>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 md:justify-items-center">
                        <div className="justify-self-start w-full">Název</div>
                        <div>Vyvolávací cena</div>
                        <div>Čas</div>
                        <div>Stav</div>
                        <div>Akce</div>
                    </div>

                    {sortedAuctions.map(auction => {
                        const statusInfo = getStatusInfo(auction.status);

                        const hasStarted = new Date(auction.starts_at).getTime() <= currentTime;
                        const isPendingOrCancelled = auction.status === Status.Pending || auction.status === Status.Canceled;
                        const canEdit = isPendingOrCancelled || !hasStarted;
                        const canEditPrice = auction.status === Status.Approved;

                        return (
                            <Link
                                to={`/aukce/detail/${auction.id}`}
                                key={auction.id}
                                className="group block outline-none focus:ring-4 focus:ring-[#4ade80]/20 rounded-2xl"
                            >
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 md:px-6 md:py-4 transition-all hover:border-[#4ade80] hover:shadow-md grid grid-cols-1 md:grid-cols-5 gap-4 md:items-center md:justify-items-center">

                                    <div className="flex flex-col md:block min-w-0 w-full md:justify-self-start" title={auction.title}>
                                        <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1 truncate">Název</span>
                                        <strong className="text-slate-900 font-bold group-hover:text-[#4ade80] transition-colors block w-full">
                                            {auction.title}
                                        </strong>
                                    </div>

                                    <div className="flex flex-col md:block">
                                        <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Vyvolávací cena</span>
                                        <span className="text-slate-700 font-medium">{auction.starting_price} Kč</span>
                                    </div>

                                    <div className="flex flex-col md:block items-start md:items-center">
                                        <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Čas</span>
                                        <TimerBadge
                                            startTime={auction.starts_at}
                                            endTime={auction.ends_at}
                                            style={true}
                                        />
                                    </div>

                                    <div className="flex flex-col md:block items-start">
                                        <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Stav</span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.className}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:block items-start md:items-center">
                                        <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Akce</span>

                                        {canEdit ? (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/upravit-aukci/${auction.id}`);
                                                }}
                                                className="px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors cursor-pointer w-full md:w-auto text-center"
                                            >
                                                Upravit nabídku
                                            </button>
                                        ) : canEditPrice ? (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/upravit-cenu-aukce/${auction.id}`);
                                                }}
                                                className="px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm font-bold transition-colors cursor-pointer w-full md:w-auto text-center"
                                            >
                                                Upravit cenu
                                            </button>
                                        ) : (
                                            <span className="px-4 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-sm font-medium italic block w-full md:w-auto text-center">
                                                Nelze upravit
                                            </span>
                                        )}
                                    </div>

                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    )
}