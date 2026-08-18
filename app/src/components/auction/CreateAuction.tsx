import { useEffect, useState } from 'react';
import Navbar from "../navbar/Navbar.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { type GroupResponse, groupService } from "../../api/groupService.ts";
import { type AxiosError } from "axios";
import {type ProductCreate, productService} from "../../api/productService.ts";
import toast from "react-hot-toast";
import Page from "../Page.tsx";
import AuctionForm, { type AuctionFormData } from "./AuctionForm.tsx";

export default function CreateAuction() {
    const { groupId } = useParams<{ groupId?: string }>();
    const navigate = useNavigate();

    const [groups, setGroups] = useState<Array<GroupResponse>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const userGroups = await groupService.getCurrentUserGroups();
                setGroups(userGroups);
            } catch {
                toast.error("Nepodařilo se načíst uživatelské skupiny.");
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const handleCreate = async (productPayload: ProductCreate, coverImage: File | null, additionalImages: FileList | null) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Vytvářím aukci...");

        try {
            await productService.createAuction(productPayload, coverImage, additionalImages);
            toast.success("Aukce byla úspěšně vytvořena!", { id: toastId });
            navigate(`/skupina/${productPayload.group_id}`);
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Při vytváření aukce došlo k chybě.";
            toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), { id: toastId });
            setIsSubmitting(false);
        }
    };

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

    const defaultInitialData: AuctionFormData = {
        title: '',
        description: '',
        category: '',
        big_preview: false,
        starting_price: '',
        min_bid: '',
        buy_now_price: '',
        starts_at: '',
        ends_at: '',
        group_id: groupId ? Number(groupId) : '',
    };

    return (
        <Page>
            <Navbar />
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 flex flex-col gap-8">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0">
                        Vytvořit novou aukci
                    </h2>

                    <AuctionForm
                        initialData={defaultInitialData}
                        groups={groups}
                        isEditMode={false}
                        isSubmitting={isSubmitting}
                        onSubmit={handleCreate}
                    />
                </div>
            </div>
        </Page>
    );
}