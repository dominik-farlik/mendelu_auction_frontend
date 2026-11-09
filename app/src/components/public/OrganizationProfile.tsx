import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Page from "../Page.tsx";
import Hero from "../Hero.tsx";
import ProfileStat from "./ProfileStat.tsx";
import AuctionContainer from "../auction/AuctionContainer.tsx";
import { type OrganizationPublicResponse, organizationService } from "../../api/organizationService.ts";
import type { ProductResponse } from "../../api/productService.ts";

export default function OrganizationProfile() {
    const { organizationId } = useParams<{ organizationId: string }>();
    const [organization, setOrganization] = useState<OrganizationPublicResponse>();
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const toastId = toast.loading("Načítání organizace...");

        Promise.all([
            organizationService.getPublicProfile(Number(organizationId)),
            organizationService.getOrganizationAuctions(Number(organizationId))
        ])
            .then(([organizationData, auctionsData]) => {
                setOrganization(organizationData);
                setAuctions(auctionsData);
                toast.dismiss(toastId);
            })
            .catch(() => {
                toast.error("Nepodařilo se načíst profil organizace.", { id: toastId });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [organizationId]);

    return (
        <Page>
            <Hero navbarTextColor="light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20 min-h-[60vh] flex flex-col justify-center gap-12 md:gap-16">
                    {!loading && !organization && (
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight m-0">
                            Organizace nenalezena
                        </h1>
                    )}

                    {organization && (
                        <>
                            <div className="max-w-3xl flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                    <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-pink-200 rounded-full flex items-center justify-center overflow-hidden">
                                        {organization.logo ? (
                                            <img
                                                src={`${import.meta.env.VITE_IMAGES_URL}/${organization.logo}`}
                                                alt={organization.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl md:text-5xl font-black text-pink-700">
                                                {organization.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight m-0 break-words min-w-0">
                                        {organization.name}
                                    </h1>
                                </div>

                                {organization.description && (
                                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed m-0 whitespace-pre-wrap">
                                        {organization.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                                <ProfileStat
                                    label="Vybráno aukcemi skupin"
                                    value={organization.total_raised.toLocaleString('cs-CZ')}
                                    unit="Kč"
                                />
                                <ProfileStat
                                    label="Ukončené aukce"
                                    value={organization.finished_auctions_count.toLocaleString('cs-CZ')}
                                />
                                <ProfileStat
                                    label="Probíhající aukce"
                                    value={organization.active_auctions_count.toLocaleString('cs-CZ')}
                                />
                            </div>

                            <p className="text-base md:text-lg text-gray-400 leading-relaxed m-0 max-w-4xl">
                                Informativní přehled za aukce skupin přiřazených k této organizaci. Výtěžek ze všech aukcí
                                se ve skutečnosti dělí rovným dílem mezi všechny podporované organizace.
                            </p>
                        </>
                    )}
                </div>
            </Hero>

            {organization && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
                    <h3 className="text-2xl font-black text-slate-900 uppercase m-0 tracking-tight border-b border-gray-200 pb-4">
                        Probíhající aukce skupin této organizace
                    </h3>

                    {auctions.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
                            <p className="text-slate-500 font-medium m-0">Skupiny této organizace momentálně nemají žádné probíhající aukce.</p>
                        </div>
                    ) : (
                        <AuctionContainer auctions={auctions} />
                    )}
                </div>
            )}
        </Page>
    );
}
