import { useEffect, useState } from "react";
import api from "../../api/axios.ts";
import type { OrderDetailResponse } from "../../types/order.ts";
import { parseTimeDistance } from "../../utils/formatDate.ts";
import toast from "react-hot-toast";

export default function FinishedAuctions({ groupId }: { groupId: number }) {
    const [orders, setOrders] = useState<OrderDetailResponse[]>([]);
    const [loadingActionId, setLoadingActionId] = useState<number | null>(null);

    useEffect(() => {
        api.get(`/orders/group/${groupId}`)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("Chyba při načítání objednávek:", error);
            });
    }, [groupId]);

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return { className: "bg-amber-100 text-amber-700", label: "Čeká na kupujícího" };
            case "paid":
                return { className: "bg-[#4ade80]/20 text-[#16a34a]", label: "Zaplaceno" };
            case "processing":
                return { className: "bg-sky-100 text-sky-700", label: "Čeká na potvrzení" };
            case "expired":
                return { className: "bg-slate-100 text-slate-500", label: "Nezaplaceno v čas" };
            case "cancelled":
            case "canceled":
                return { className: "bg-red-100 text-red-700", label: "Odmítnuto" };
            default:
                return { className: "bg-slate-100 text-slate-700", label: status };
        }
    };

    const getTimeUntilExpiry = (expiresAt: string) => {
        const distance = new Date(expiresAt).getTime() - new Date().getTime();

        if (distance <= 0) {
            return "Vypršelo";
        }

        const { days, hours, minutes } = parseTimeDistance(distance);

        const parts = [];
        if (days > 0) parts.push(`${days} d`);
        if (hours > 0) parts.push(`${hours} h`);
        if (minutes > 0 && days === 0 || parts.length === 0) parts.push(`${minutes} m`);

        return `Další za: ${parts.join(" ")}`;
    };

    const handleMarkPaid = async (orderId: number) => {
        setLoadingActionId(orderId);
        await api.post(`/orders/${orderId}/mark-paid`)
            .then(()=> {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.order_id === orderId ? { ...order, status: "paid" } : order
                    )
                );

                toast.success("Platba byla potvrzena.")
            })
            .catch((error)=> toast.error(error.response?.data?.detail || "Nepodařilo se potvrdit platbu."))
            .finally(() => setLoadingActionId(null));
    };

    const sortedOrders = [...orders].sort((a, b) => {
        return new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime();
    });

    return (
        <>
            {sortedOrders.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
                    <span className="text-slate-500 font-medium">Ve vaší skupině zatím nejsou žádné ukončené nabídky.</span>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 md:justify-items-center">
                        <div className="justify-self-start w-full">Název produktu</div>
                        <div>Částka</div>
                        <div className="justify-self-start w-full">Kupující a doprava</div>
                        <div>Stav</div>
                        <div>Akce</div>
                    </div>

                    {sortedOrders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const timeExpiry = order.expires_at ? getTimeUntilExpiry(order.expires_at) : "Není určen";
                        const isProcessing = order.status.toLowerCase() === "processing";
                        const isPending = order.status.toLowerCase() === "pending";
                        const isExpired = timeExpiry === "Vypršelo";

                        return (
                            <div
                                key={order.order_id}
                                className="bg-white border border-slate-200 rounded-2xl p-4 md:px-6 md:py-4 transition-all hover:border-slate-300 hover:shadow-md grid grid-cols-1 md:grid-cols-5 gap-4 md:items-center md:justify-items-center"
                            >
                                <div className="flex flex-col md:block min-w-0 w-full md:justify-self-start" title={order.product.title}>
                                    <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Název produktu</span>
                                    <strong className="text-slate-900 font-bold block w-full truncate">
                                        {order.product.title}
                                    </strong>
                                    <span className="text-xs text-slate-400 block mt-0.5">
                                        VS: {order.variable_symbol}
                                    </span>
                                </div>

                                <div className="flex flex-col md:block">
                                    <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Částka</span>
                                    <span className="text-slate-900 font-bold">{order.amount} Kč</span>
                                </div>

                                <div className="flex flex-col md:block min-w-0 w-full md:justify-self-start">
                                    <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Kupující a doprava</span>
                                    <a
                                        href={`mailto:${order.buyer.email}`}
                                        className="text-xs text-[#00c4ff] hover:text-sky-700 hover:underline block truncate font-medium"
                                    >
                                        {order.buyer.email}
                                    </a>

                                    {order.delivery_method && (
                                        <div className="mt-1.5 flex flex-col gap-1 items-start">
                                            {order.delivery_method === "pickup" ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                                    🤝 Osobní předání
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                                                        📦 Doručení
                                                    </span>
                                                    {order.shipping_address && (
                                                        <span className="text-xs text-slate-500 block break-words w-full">
                                                            {order.shipping_address}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col md:block items-start md:items-center text-center">
                                    <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Stav</span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.className}`}>
                                        {statusInfo.label}
                                    </span>

                                    {isPending && (
                                        <span className={`block text-[11px] font-medium mt-1.5 italic ${isExpired ? "text-red-500" : "text-slate-400"}`}>
                                            {isExpired ? "Vypršelo" : timeExpiry}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col md:block items-start md:items-center w-full md:w-auto text-center">
                                    <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Akce</span>

                                    {isProcessing ? (
                                        <button
                                            onClick={() => handleMarkPaid(order.order_id)}
                                            disabled={loadingActionId === order.order_id}
                                            className="px-4 py-1.5 bg-[#4ade80] text-slate-900 hover:bg-[#22c55e] rounded-lg text-sm font-bold transition-colors cursor-pointer w-full md:w-auto text-center disabled:opacity-50"
                                        >
                                            {loadingActionId === order.order_id ? "Ukládám..." : "Potvrdit platbu"}
                                        </button>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic block text-center w-full md:w-auto">
                                            Žádná akce
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}