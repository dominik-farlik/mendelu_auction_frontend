import { useState } from "react";
import type { ProductImageResponse } from "../../api/productService.ts";

export default function ImageGallery({coverImage, otherImages}: {coverImage: string, otherImages: ProductImageResponse[]}) {
    const [userSelectedImage, setUserSelectedImage] = useState<string | null>(null);

    const currentImage = userSelectedImage || coverImage;

    const allImages = [
        coverImage,
        ...(otherImages?.map(img => img.filename) || [])
    ].filter(Boolean);

    return (
        <div className="flex-1 w-full relative z-10 flex flex-col items-center lg:items-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[110%] aspect-square rounded-full border-[5px] border-[#4ade80]/80 shadow-[5px_5px_50px_rgba(74,222,128,0.2)] pointer-events-none hidden lg:block z-0"></div>

            <div className="relative z-10 w-full max-w-150 shadow-2xl rounded-4xl overflow-hidden bg-black/20 ring-1 ring-white/10">
                {currentImage ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGES_URL}/${currentImage}`}
                        alt="Hlavní obrázek nabídky"
                        className="w-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full flex items-center justify-center text-white/30 h-64">
                        Načítání obrázku...
                    </div>
                )}
            </div>

            {allImages.length > 1 && (
                <div className="relative z-10 flex gap-3 mt-4 overflow-x-auto w-full max-w-150 pb-2 scrollbar-hide">
                    {allImages.map((imgName, index) => {
                        const isSelected = currentImage === imgName;
                        return (
                            <button
                                key={index}
                                onClick={() => setUserSelectedImage(imgName)}
                                className={`shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-black/20 ${
                                    isSelected
                                        ? 'border-[#4ade80] opacity-100 ring-2 ring-[#4ade80]/30 ring-offset-2 ring-offset-[#151b2b]'
                                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/30'
                                }`}
                            >
                                <img
                                    src={`${import.meta.env.VITE_IMAGES_URL}/${imgName}`}
                                    alt={`Náhled produktu ${index + 1}`}
                                    className="w-20 h-20 md:w-24 md:h-24 object-cover"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    )
}