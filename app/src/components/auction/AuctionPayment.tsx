import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SubmitButton from "../buttons/SubmitButton.tsx";
import UserPage from "../profile/UserPage.tsx";
import api from "../../api/axios.ts";
import type {OrderDetailResponse} from "../../types/order.ts";

export default function AuctionPayment() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<OrderDetailResponse>();
    const [loading, setLoading] = useState<boolean>(true);
    const [deliveryMethod, setDeliveryMethod] = useState<"personal" | "shipping">("personal");
    const [address, setAddress] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        api.get(`/orders/by-product/${productId}`)
            .then((res) => {
                setOrder(res.data);
            })
            .catch(() => {
                toast.error("Nepodařilo se načíst detail platby.");
                navigate("/profil/vyhry");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [productId, navigate]);

    const handleRejectWin = async () => {
        if (!window.confirm("Opravdu chcete odmítnout tuto výhru? Tuto akci nelze vzít zpět a nabídka bude posunuta dalšímu zájemci.")) {
            return;
        }

        await api.post(`/orders/${order?.order_id}/cancel-win`)
            .then(() => {
                toast.success("Výhra byla odmítnuta.");
                navigate("/profil/vyhry");
            })
            .catch(()=> toast.error("Nepodařilo se odmítnout výhru."));
    };

    const handleSaveDelivery = async (e: React.FormEvent) => {
        e.preventDefault();

        if (deliveryMethod === "shipping" && !address.trim()) {
            toast.error("Zadejte prosím doručovací adresu.");
            return;
        }

        setSubmitting(true);

        try {
            await api.post(`/orders/${order?.order_id}/confirm`, {
                delivery_method: deliveryMethod,
                shipping_address: address
            });

            toast.success(
                "Platba a způsob doručení byl potvrzen. \n\nNyní prosím vyčkejte na potvrzení naším týmem, děkujeme.",
                { duration: 10000 }
            );

            navigate("/profil/vyhry");
        } catch {
            toast.error("Nepodařilo se potvrdit platbu a doručení. Zkuste to prosím znovu.");
        } finally {
            setSubmitting(false);
        }
    };

    const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] focus:bg-white transition-all shadow-sm";
    const labelClasses = "text-sm font-bold text-slate-600 pl-1";

    if (loading) {
        return (
            <UserPage currentWindow="vyhry">
                <div className="flex justify-center items-center py-20 grow">
                    <svg className="animate-spin h-8 w-8 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </UserPage>
        );
    }

    return (
        <UserPage currentWindow="vyhry">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Platba a doručení výhry</h2>

            <div className="flex flex-col gap-8 max-w-3xl">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                    {order?.product.cover_image && (
                        <img
                            src={`${import.meta.env.VITE_IMAGES_URL}/${order.product.cover_image}`}
                            alt=""
                            className="w-32 h-32 object-cover rounded-2xl shrink-0"
                        />
                    )}
                    <div className="flex flex-col grow">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {order?.product.group.organization}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{order?.product.title}</h3>
                        <div className="text-2xl font-black text-slate-900">
                            {order?.amount.toLocaleString('cs-CZ')} Kč
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-slate-900">Platební instrukce</h3>
                    <p className="text-sm text-slate-600">
                        Pro uhrazení vyhrané aukce použijte prosím níže uvedené údaje. Jako <strong>variabilní symbol</strong> zadejte ID vaší objednávky.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div>
                            <span className="text-xs text-slate-400 font-bold block mb-1">Číslo účtu (transparentní):</span>
                            <span className="text-base font-black text-slate-900">{order?.bank_account}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 font-bold block mb-1">Variabilní symbol (VS):</span>
                            <span className="text-base font-black text-slate-900">{order?.variable_symbol}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSaveDelivery} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="text-lg font-bold text-slate-900">Způsob převzetí / doručení</h3>

                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 rounded-2xl border cursor-pointer font-bold text-sm transition-all flex items-center gap-3 ${deliveryMethod === 'personal' ? 'border-[#4ade80] bg-[#4ade80]/10 text-slate-900' : 'border-slate-200 text-slate-600'}`}>
                            <input
                                type="radio"
                                name="delivery"
                                checked={deliveryMethod === 'personal'}
                                onChange={() => setDeliveryMethod('personal')}
                                className="accent-[#4ade80]"
                            />
                            Fyzické převzetí u školy
                        </label>

                        <label className={`flex-1 p-4 rounded-2xl border cursor-pointer font-bold text-sm transition-all flex items-center gap-3 ${deliveryMethod === 'shipping' ? 'border-[#4ade80] bg-[#4ade80]/10 text-slate-900' : 'border-slate-200 text-slate-600'}`}>
                            <input
                                type="radio"
                                name="delivery"
                                checked={deliveryMethod === 'shipping'}
                                onChange={() => setDeliveryMethod('shipping')}
                                className="accent-[#4ade80]"
                            />
                            Zaslat na adresu
                        </label>
                    </div>

                    {deliveryMethod === 'shipping' && (
                        <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                            <label className={labelClasses}>Doručovací adresa*</label>
                            <input
                                type="text"
                                placeholder="Ulice, č. p., město, PSČ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={inputClasses}
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <SubmitButton title={submitting ? "Ukládám..." : "Potvrdit platbu a uložit způsob doručení"} size="medium" />
                    </div>
                </form>

                <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h4 className="font-bold text-rose-900">Odmítnutí výhry</h4>
                        <p className="text-xs text-rose-700">Pokud o položku již nemáte zájem, můžete výhru odmítnout. Nabídka se automaticky posune dalšímu dražiteli.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRejectWin}
                        className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold transition-colors shrink-0 shadow-sm"
                    >
                        Odmítnout výhru
                    </button>
                </div>
            </div>
        </UserPage>
    );
}