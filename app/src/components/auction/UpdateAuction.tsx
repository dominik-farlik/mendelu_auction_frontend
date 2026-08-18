import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Page from "../Page.tsx";
import Navbar from "../navbar/Navbar.tsx";
import AuctionForm, { type AuctionFormData } from "./AuctionForm.tsx";
import toast from "react-hot-toast";
import { type GroupResponse, groupService } from "../../api/groupService.ts";
import {type ProductCreate, productService} from "../../api/productService.ts";
import type { AxiosError } from "axios";

const formatForDatetimeLocal = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

export default function UpdateAuction() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [groups, setGroups] = useState<Array<GroupResponse>>([]);
    const [initialData, setInitialData] = useState<AuctionFormData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [userGroups, product] = await Promise.all([
                    groupService.getCurrentUserGroups(),
                    productService.getProductDetail(Number(productId))
                ]);

                setGroups(userGroups);
                setInitialData({
                    title: product.title || '',
                    description: product.description || '',
                    category: '',
                    big_preview: product.big_preview || false,
                    starting_price: product.starting_price?.toString() || '',
                    min_bid: product.min_bid?.toString() || '',
                    buy_now_price: product.buy_now_price?.toString() || '',
                    starts_at: formatForDatetimeLocal(product.starts_at),
                    ends_at: formatForDatetimeLocal(product.ends_at),
                    group_id: product.group?.id,
                });

            } catch {
                toast.error("Nepodařilo se načíst data aukce.");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchInitialData();
        }
    }, [productId]);

    const handleUpdate = async (productPayload: ProductCreate, coverImage: File | null, additionalImages: FileList | null) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Ukládám úpravy...");

        try {
            await productService.updateAuction(Number(productId), productPayload, coverImage, additionalImages);
            toast.success("Aukce byla úspěšně upravena!", { id: toastId });
            navigate(`/skupina/${productPayload.group_id}`);
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Při úpravě aukce došlo k chybě.";
            toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), { id: toastId });
            setIsSubmitting(false);
        }
    };

    if (loading || !initialData) {
        return (
            <Page>
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-slate-500 font-bold">Načítám data...</p>
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
                        Upravit aukci
                    </h2>

                    <AuctionForm
                        initialData={initialData}
                        groups={groups}
                        isEditMode={true}
                        isSubmitting={isSubmitting}
                        onSubmit={handleUpdate}
                    />
                </div>
            </div>
        </Page>
    );
}