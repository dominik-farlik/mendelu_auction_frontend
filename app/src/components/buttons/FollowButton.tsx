import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { useState, useEffect } from "react";
import {productService} from "../../api/productService.ts";

type FollowButtonProps = {
    productId: number;
    productIsFollowed: boolean;
    btnFill?: boolean;
    variant?: 'detail' | 'preview';
};

export default function FollowButton({productId, productIsFollowed, btnFill = false, variant = 'detail'
                                     }: FollowButtonProps) {
    const [isFollowed, setIsFollowed] = useState<boolean>(productIsFollowed);
    const [processingFollow, setProcessingFollow] = useState<boolean>(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsFollowed(productIsFollowed);
    }, [productIsFollowed]);

    const isPreview = variant === 'preview';

    const handleFollowToggle = async () => {
        setProcessingFollow(true);

        const requestPromise = isFollowed
            ? productService.unfollowProduct(productId)
            : productService.followProduct(productId);

        const successMessage = isFollowed
            ? "Sledování aukce bylo zrušeno."
            : "Aukce byla přidána do sledovaných!";

        await toast.promise(requestPromise, {
            loading: "Zpracování požadavku...",
            success: () => {
                setIsFollowed(!isFollowed);
                return successMessage;
            },
            error: (err) => {
                const axiosError = err as AxiosError<{ detail?: string }>;
                return axiosError.response?.data?.detail || "Akci se nepodařilo dokončit.";
            }
        }).finally(() => setProcessingFollow(false));
    };

    const detailOutline = btnFill ? 'border-slate-900/20 text-slate-900 hover:bg-black/5' : 'border-gray-200 text-slate-700 hover:bg-gray-50';
    const detailActive = btnFill ? 'bg-black/10 border-transparent text-slate-900 hover:bg-black/20' : 'bg-gray-100 border-transparent text-slate-900 hover:bg-gray-200';

    const previewBase = "flex items-center justify-center w-9 h-9 rounded-full shadow-sm backdrop-blur-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-wait";
    const previewState = isFollowed ? "bg-white text-emerald-500 hover:bg-white/90" : "bg-white/80 text-slate-600 hover:bg-white";

    return (
        <button
            onClick={handleFollowToggle}
            disabled={processingFollow}
            className={`
                ${isPreview
                ? `${previewBase} ${previewState}`
                : `flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-colors disabled:opacity-70 disabled:cursor-wait ${isFollowed ? detailActive : detailOutline}`
            }
            `}
            title={isFollowed ? "Zrušit sledování" : "Sledovat aukci"}
        >
            <svg
                width={isPreview ? "18" : "16"}
                height={isPreview ? "18" : "16"}
                viewBox="0 0 24 24"
                fill={isFollowed ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>

            {!isPreview && (
                <span>{isFollowed ? "Sledováno" : "Sledovat aukci"}</span>
            )}
        </button>
    );
}