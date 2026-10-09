import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../Page.tsx";
import Navbar from "../navbar/Navbar.tsx";
import toast from "react-hot-toast";
import { productService } from "../../api/productService.ts";
import type { AxiosError } from "axios";
import SubmitButton from "../buttons/SubmitButton.tsx";

interface PriceForm {
    starting_price?: string;
    min_bid?: string;
    buy_now_price?: string;
}

export default function UpdateAuctionPrice() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<PriceForm | null>(null);
    const [groupId, setGroupId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        productService.getProductDetail(Number(productId))
            .then((data) => {
                setForm({
                    starting_price: String(data.starting_price ?? ""),
                    min_bid: String(data.min_bid ?? ""),
                    buy_now_price: String(data.buy_now_price ?? ""),
                });
                setGroupId(data.group.id);
            })
            .catch(() => toast.error("Nepodařilo se načíst data aukce."))
            .finally(() => setLoading(false));
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Ukládám úpravy...");

        try {
            await productService.updateAuctionPrice(Number(productId), {
                starting_price: Number(form.starting_price),
                min_bid: Number(form.min_bid),
                buy_now_price: Number(form.buy_now_price),
            });
            toast.success("Aukce byla úspěšně upravena!", { id: toastId });
            navigate(groupId ? `/skupina/${groupId}` : -1 as never);
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Při úpravě aukce došlo k chybě.";
            toast.error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg), { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] transition-all text-slate-900 font-medium placeholder:text-slate-400";
    const labelClasses = "text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 block mb-2";

    if (loading) {
        return (
            <Page>
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-slate-500 font-bold">Načítám data...</p>
                </div>
            </Page>
        );
    }

    // Guard on the data itself, so `form` is narrowed to non-null below
    if (!form) {
        return (
            <Page>
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-slate-500 font-bold">Data aukce se nepodařilo načíst.</p>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <Navbar />
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 flex flex-col gap-8">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0">
                        Upravit cenu aukce
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div>
                                <label htmlFor="starting_price" className={labelClasses}>Počáteční cena (Kč)</label>
                                <input
                                    id="starting_price"
                                    type="number"
                                    step="1"
                                    name="starting_price"
                                    required={!form.buy_now_price}
                                    value={form.starting_price}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    min={0}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label htmlFor="min_bid" className={labelClasses}>Minimální příhoz (Kč)</label>
                                <input
                                    id="min_bid"
                                    type="number"
                                    step="1"
                                    name="min_bid"
                                    value={form.min_bid}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    min={1}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label htmlFor="buy_now_price" className={labelClasses}>Cena Kup teď (Kč)</label>
                                <input
                                    id="buy_now_price"
                                    type="number"
                                    step="1"
                                    name="buy_now_price"
                                    required={!form.starting_price}
                                    value={form.buy_now_price}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    min={1}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-6 mt-2 border-t border-slate-100">
                            <SubmitButton
                                title={isSubmitting ? "Ukládá se..." : "Uložit změny"}
                                size="large"
                                disabled={isSubmitting}
                                cursor={isSubmitting ? "not-allowed" : "pointer"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Page>
    );
}