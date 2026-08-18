import React, { useState } from "react";
import { SaleType } from "../../types/product.ts";
import type { GroupResponse } from "../../api/groupService.ts";
import SubmitButton from "../buttons/SubmitButton.tsx";
import type { ProductCreate } from "../../api/productService.ts";
import toast from "react-hot-toast";

export interface AuctionFormData {
    title: string;
    description: string;
    sale_type: SaleType;
    big_preview: boolean;
    starting_price: string | number;
    min_bid: string | number;
    buy_now_price: string | number;
    starts_at: string;
    ends_at: string;
    group_id: string | number;
}

interface AuctionFormProps {
    initialData: AuctionFormData;
    groups: GroupResponse[];
    isEditMode: boolean;
    isSubmitting: boolean;
    onSubmit: (payload: ProductCreate, coverImage: File | null, additionalImages: FileList | null) => Promise<void>;
}

export default function AuctionForm({ initialData, groups, isEditMode, isSubmitting, onSubmit }: AuctionFormProps) {
    const [formData, setFormData] = useState<AuctionFormData>(initialData);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [additionalImages, setAdditionalImages] = useState<FileList | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAdditionalImages(e.target.files);
        }
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.starts_at && formData.ends_at) {
            const startDate = new Date(formData.starts_at);
            const endDate = new Date(formData.ends_at);
            const now = new Date();

            if (!isEditMode && startDate < now) {
                toast.error("Začátek aukce nesmí být v minulosti.");
                return;
            }

            if (startDate >= endDate) {
                toast.error("Konec aukce musí být nastaven až po jejím začátku.");
                return;
            }
        }

        const productPayload = {
            title: formData.title,
            description: formData.description || null,
            sale_type: formData.sale_type,
            big_preview: formData.big_preview,
            starting_price: parseFloat(formData.starting_price.toString()),
            min_bid: formData.min_bid ? parseFloat(formData.min_bid.toString()) : null,
            buy_now_price: formData.buy_now_price ? parseFloat(formData.buy_now_price.toString()) : null,
            starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
            ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
            group_id: Number(formData.group_id),
        };

        await onSubmit(productPayload, coverImage, additionalImages);
    };

    // Pomocná funkce pro získání aktuálního data/času ve formátu pro <input type="datetime-local">
    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] transition-all text-slate-900 font-medium placeholder:text-slate-400";
    const labelClasses = "text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 block mb-2";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Skupina</label>
                    <select
                        name="group_id"
                        required
                        value={formData.group_id}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="" disabled>Vyberte skupinu</option>
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>Typ prodeje</label>
                    <select
                        name="sale_type"
                        value={formData.sale_type}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value={SaleType.Auction}>Aukce</option>
                        <option value={SaleType.BuyNow}>Kup teď</option>
                        <option value={SaleType.Both}>Obojí</option>
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClasses}>Název produktu</label>
                <input
                    type="text"
                    name="title"
                    maxLength={100}
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="např. Večeře s děkanem"
                />
            </div>

            <div>
                <label className={labelClasses}>Popis</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`${inputClasses} resize-none`}
                    placeholder="Detailně popište, co je předmětem aukce..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                <div>
                    <label className={labelClasses}>Počáteční cena (Kč)</label>
                    <input
                        type="number"
                        step="1"
                        name="starting_price"
                        required
                        value={formData.starting_price}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Minimální příhoz (Kč)</label>
                    <input
                        type="number"
                        step="1"
                        name="min_bid"
                        required
                        value={formData.min_bid}
                        onChange={handleChange}
                        className={inputClasses}
                        min={1}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className={labelClasses}>Cena Kup teď (nepovinné)</label>
                    <input
                        type="number"
                        step="1"
                        name="buy_now_price"
                        value={formData.buy_now_price}
                        onChange={handleChange}
                        className={inputClasses}
                        min={1}
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>Začátek aukce</label>
                    <input
                        type="datetime-local"
                        name="starts_at"
                        value={formData.starts_at}
                        onChange={handleChange}
                        min={!isEditMode ? getCurrentDateTimeLocal() : undefined}
                        className={inputClasses}
                    />
                </div>
                <div>
                    <label className={labelClasses}>Konec aukce</label>
                    <input
                        type="datetime-local"
                        name="ends_at"
                        value={formData.ends_at}
                        onChange={handleChange}
                        min={formData.starts_at || getCurrentDateTimeLocal()}
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                    <label className={labelClasses}>Hlavní obrázek {isEditMode && '(nepovinné)'}</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:font-bold file:bg-[#4ade80]/20 hover:file:bg-[#4ade80]/30 transition-all cursor-pointer"
                    />
                    {isEditMode && <p className="text-xs text-slate-400 mt-2">Ponechte prázdné, pokud nechcete měnit původní fotku.</p>}
                </div>

                <div>
                    <label className={labelClasses}>Další obrázky {isEditMode && '(nepovinné)'}</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleFilesChange}
                        className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition-all cursor-pointer"
                    />
                    {isEditMode && <p className="text-xs text-slate-400 mt-2">Při nahrání nových fotek mohou být staré smazány.</p>}
                </div>
            </div>

            <div className="flex items-center gap-3 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <input
                    type="checkbox"
                    name="big_preview"
                    id="big_preview"
                    checked={formData.big_preview}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-[#4ade80] focus:ring-[#4ade80]/20 cursor-pointer accent-[#4ade80]"
                />
                <label htmlFor="big_preview" className="text-slate-700 font-medium cursor-pointer select-none">
                    Zobrazit jako velký náhled (Hero banner na titulní straně)
                </label>
            </div>

            <div className="flex justify-end pt-6 mt-2 border-t border-slate-100">
                <SubmitButton
                    title={isSubmitting ? 'Ukládá se...' : (isEditMode ? 'Uložit změny' : 'Vytvořit aukci')}
                    size="large"
                    disabled={isSubmitting}
                    cursor={isSubmitting ? 'not-allowed' : 'pointer'}
                />
            </div>
        </form>
    );
}