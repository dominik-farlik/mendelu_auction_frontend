import { useEffect, useState } from "react";
import { type ProductBids, type ProductResponse, productService } from "../../api/productService.ts";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BidWindow from "./BidWindow.tsx";
import {Category, Status} from "../../types/product.ts";
import { formatDate, parseTimeDistance } from "../../utils/formatDate.ts";
import Hero from "../Hero.tsx";
import ImageGallery from "./ImageGallery.tsx";
import Page from "../Page.tsx";
import {Role} from "../../types/user.ts";
import {useAuth} from "../../context/useAuth.ts";

export default function AuctionDetail() {
    const { productId } = useParams<{ productId: string }>();
    const { user } = useAuth()
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductResponse>({
        id: Number(productId),
        big_preview: false,
        buy_now_price: 0,
        cover_image: "",
        created_at: "",
        created_by_id: 0,
        ends_at: "",
        images: [],
        starting_price: 0,
        starts_at: "",
        status: Status.Pending,
        title: "",
        description: "",
        category: Category.Other,
        is_followed: false,
        group: {
            id: 0,
            name: "",
            organization: "",
        },
        bids: []
    });

    useEffect(() => {
        productService.getProductDetail(Number(productId))
            .then((data) => {
                setProduct(data);
            });
    }, [productId]);

    useEffect(() => {
        if (!productId || product.status === Status.Pending) return;

        if (product.status === Status.Finished || product.status === 'cancelled') {
            return;
        }

        const wsUrl = `${import.meta.env.VITE_WS_URL}/auctions/${productId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Připojeno k live aukci:", productId);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'NEW_BID') {
                const newBid: ProductBids = data.payload;

                setProduct((prevProduct) => {
                    const updatedBids = [newBid, ...(prevProduct.bids || [])];
                    updatedBids.sort((a, b) => b.amount - a.amount);
                    return {
                        ...prevProduct,
                        bids: updatedBids
                    };
                });
            }
            else if (data.type === 'AUCTION_ENDED') {
                const payload = data.payload;

                if (payload.final_price) {
                    toast.success(`Aukce skončila! Vítězná částka: ${payload.final_price.toLocaleString('cs-CZ')} Kč`, {
                        duration: 6000,
                        icon: '🎉',
                    });
                } else {
                    toast('Aukce skončila bez příhozů.', {
                        duration: 5000,
                        icon: '⏳',
                    });
                }

                setProduct((prevProduct) => ({
                    ...prevProduct,
                    status: Status.Finished
                }));
            }
        };

        ws.onclose = () => {
            console.log("Odpojeno od live aukce");
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };

    }, [productId, product.status]);

    const calculateTimeLeft = (bid_time: string) => {
        if (!product.ends_at) return;

        const bidTime = new Date(bid_time).getTime();
        const now = new Date().getTime();
        const distance = now - bidTime;

        const { days, hours, minutes } = parseTimeDistance(distance);

        if (days > 1) return `před ${days} dny`;
        if (days > 0) return `před ${days} dnem`;
        if (hours > 1) return `před ${hours} hodinami`;
        if (hours > 0) return `před ${hours} hodinou`;
        if (minutes > 1) return `před ${minutes} minutami`;
        if (minutes > 0) return `před ${minutes} minutou`;
        return "před pár sekundami";
    };

    const handleApprove = async () => {
        const toastId = toast.loading("Schvaluji aukci...");
        try {
            await productService.updateProductStatus(product.id, 'approved');
            toast.success("Aukce byla úspěšně schválena", { id: toastId });
            setProduct(prev => ({ ...prev, status: Status.Approved }));
        } catch {
            toast.error("Nepodařilo se schválit aukci", { id: toastId });
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Opravdu chcete tuto aukci zamítnout?")) return;

        const toastId = toast.loading("Zamítám aukci...");
        try {
            await productService.updateProductStatus(product.id, 'cancelled');
            toast.success("Aukce byla zamítnuta", { id: toastId });
            navigate(-1);
        } catch {
            toast.error("Nepodařilo se zamítnout aukci", { id: toastId });
        }
    };

    const canAssess = product.status === Status.Pending &&
        user && user.role.name === Role.Manager;

    return (
        <Page>
            <Hero navbarTextColor="light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 flex flex-col-reverse lg:flex-row gap-12 lg:gap-8 items-center lg:items-start">
                    <div className="flex-1 flex flex-col gap-8 w-full z-20">
                        <div>
                            {/* Manažerský schvalovací banner */}
                            {canAssess && (
                                <div className="mb-6 bg-amber-500/20 backdrop-blur-md border border-amber-400/50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-white font-black text-lg uppercase tracking-tight m-0">Aukce čeká na schválení</h3>
                                        <p className="text-amber-100/90 text-sm m-0 mt-1">Zkontrolujte údaje a rozhodněte o spuštění aukce.</p>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={handleReject}
                                            className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-300 font-bold rounded-xl border border-red-500/30 hover:bg-red-500/20 transition-colors cursor-pointer"
                                        >
                                            Zamítnout
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            className="flex-1 sm:flex-none px-4 py-2 bg-[#4ade80] text-slate-900 font-bold rounded-xl hover:bg-[#22c55e] transition-colors cursor-pointer"
                                        >
                                            Schválit aukci
                                        </button>
                                    </div>
                                </div>
                            )}

                            <h1
                                className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight mb-6 line-clamp-2"
                                title={product.title}
                            >
                                {product.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-lg font-medium">
                                <span className="text-gray-300">Výtěžek aukce obdrží:</span>
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                                        <span className="text-xs font-bold text-pink-700">
                                            {product.group.organization?.charAt(0) || "O"}
                                        </span>
                                    </div>
                                    <span className="font-bold underline decoration-2 underline-offset-4 decoration-white/30 hover:decoration-white transition-colors cursor-pointer">
                                        {product.group.organization}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <BidWindow product={product} />
                    </div>
                    <ImageGallery coverImage={product.cover_image} otherImages={product.images}/>
                </div>
            </Hero>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
                        <h3 className="text-2xl font-black text-[#4ade80] uppercase tracking-tight m-0">Popis aukce</h3>
                        <h3 className="text-2xl font-black text-gray-300 hover:text-gray-400 cursor-pointer uppercase tracking-tight m-0 transition-colors">Časté otázky</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span>Autor aukce:</span>
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center text-[10px] text-pink-700">
                                    {product.group.name?.charAt(0) || "A"}
                                </div>
                                <span className="underline decoration-gray-300 underline-offset-4 cursor-pointer hover:decoration-gray-400">
                                    {product.group.name}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span>Založeno:</span> <span className="font-bold text-slate-900">{formatDate(product.starts_at)}</span>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {product.description || "Tato aukce zatím nemá žádný podrobný popis."}
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col">
                    <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
                        <div className="flex items-end justify-between border-b border-gray-100 pb-4 mb-4">
                            <h3 className="text-xl font-black text-slate-900 uppercase m-0 tracking-tight">Historie příhozů</h3>
                            <div className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {product.bids?.length || 0}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                            {product.bids.length === 0 ? (
                                <div className="text-center text-gray-400 py-8 font-medium">
                                    Zatím nebyly učiněny žádné příhozy.
                                </div>
                            ) : (
                                product.bids.map((bid, index) => (
                                    <div key={index} className="flex justify-between items-center py-3 px-3 hover:bg-gray-50 rounded-xl transition-colors gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
                                            <span
                                                className="font-bold text-slate-900 truncate"
                                                title={`${bid.bidder.first_name} ${bid.bidder.public_last_name ? bid.bidder.last_name : ''}`}
                                            >
                                                {bid.bidder.first_name} {bid.bidder.public_last_name && bid.bidder.last_name}
                                            </span>
                                            <span className="text-gray-400 text-sm whitespace-nowrap shrink-0">
                                                <span className="hidden sm:inline">•</span> {calculateTimeLeft(bid.bid_time)}
                                            </span>
                                        </div>

                                        <div className="font-black text-lg text-slate-900 shrink-0">
                                            {bid.amount.toLocaleString('cs-CZ')} Kč
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}