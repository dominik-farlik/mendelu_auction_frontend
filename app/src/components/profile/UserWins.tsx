import UserPage from "./UserPage.tsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../api/userService.ts";
import LinkButton from "../buttons/LinkButton.tsx";
import type { ProductWinResponse } from "../../types/product.ts";
import {parseTimeDistance} from "../../utils/formatDate.ts";

const formatPaymentTime = (distance: number): string => {
    const { seconds, days, hours, minutes } = parseTimeDistance(distance);

    if (days > 0) return `${days} d ${hours} h`;
    if (hours > 0) return `${hours} h ${minutes} m`;
    if (minutes > 0) return `${minutes} m ${seconds} s`;
    return `${seconds} s`;
};

function PaymentTimerBadge({ expiresAt, status }: { expiresAt: string; status: string }) {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState<boolean>(false);

    useEffect(() => {
        if (status !== "pending") return;

        const targetTime = new Date(expiresAt).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const distance = targetTime - now;

            if (distance <= 0) {
                setIsExpired(true);
                setTimeLeft("Expirováno");
                return true;
            }

            setTimeLeft(formatPaymentTime(distance));
            return false;
        };

        if (updateTimer()) return;

        const interval = setInterval(() => {
            if (updateTimer()) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, status]);

    if (status === "paid") {
        return (
            <div className="bg-emerald-500 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white tracking-wide shadow-sm">
                Vyhráno
            </div>
        );
    }

    if (status === "processing") {
        return (
            <div className="bg-blue-500 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white tracking-wide shadow-sm">
                Čeká na potvrzení
            </div>
        );
    }

    if (status === "expired" || isExpired) {
        return (
            <div className="bg-rose-500 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white tracking-wide shadow-sm">
                Expirováno (nezaplaceno)
            </div>
        );
    }

    return (
        <div className="bg-amber-500 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white tracking-wide shadow-sm">
            {timeLeft ? `Platba do: ${timeLeft}` : "Načítání..."}
        </div>
    );
}

export default function UserWins() {
    const [auctions, setAuctions] = useState<ProductWinResponse[]>([]);

    useEffect(() => {
        const toastId = toast.loading("Načítám vyhrané aukce...");

        userService.getWins()
            .then((data) => {
                setAuctions(data);
                toast.dismiss(toastId);
            })
            .catch((error) => {
                console.error(`Chyba při načítání vyhraných aukcí:`, error);
                toast.error("Nepodařilo se načíst data", { id: toastId });
            });
    }, []);

    return (
        <UserPage currentWindow="vyhry">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Vyhrané aukce</h2>
            <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300">
                {auctions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {auctions.map((auction) => {
                            return (
                                <div key={auction.order_id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-64 overflow-hidden bg-slate-100 shrink-0">
                                        {auction.product.cover_image ? (
                                            <img
                                                src={`${import.meta.env.VITE_IMAGES_URL}/${auction.product.cover_image}`}
                                                alt={auction.product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full flex items-center justify-center text-white h-64 bg-black/10 animate-pulse">
                                                Načítání obrázku...
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 z-10">
                                            <PaymentTimerBadge expiresAt={auction.expires_at} status={auction.status} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col grow p-6">
                                        <div className="mb-3">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                {auction.product.group.organization} • {auction.product.group.name}
                                            </p>
                                            <h4 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
                                                {auction.product.title}
                                            </h4>
                                        </div>

                                        {auction.product.description && (
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                                {auction.product.description}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-500 font-medium">
                                                    Konečná cena
                                                </span>
                                                <span className="text-xl font-black text-slate-900">
                                                    {auction.amount.toLocaleString('cs-CZ')} Kč
                                                </span>
                                            </div>

                                            {auction.status === "pending" && (
                                                <LinkButton
                                                    title="Zaplatit"
                                                    link={`/aukce/platba/${auction.product.id}`}
                                                    size="medium"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <span className="text-slate-500 font-medium">
                            Zatím jste nevyhráli žádnou aukci.
                        </span>
                    </div>
                )}
            </div>
        </UserPage>
    );
}