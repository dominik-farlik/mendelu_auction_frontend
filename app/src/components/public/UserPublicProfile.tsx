import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Page from "../Page.tsx";
import Hero from "../Hero.tsx";
import ProfileStat from "./ProfileStat.tsx";
import AuctionContainer from "../auction/AuctionContainer.tsx";
import { type UserPublicResponse, userService } from "../../api/userService.ts";
import type { ProductResponse } from "../../api/productService.ts";
import OrganizationsBand from "../OrganizationsBand.tsx";

export default function UserPublicProfile() {
    const { userId } = useParams<{ userId: string }>();
    const [profile, setProfile] = useState<UserPublicResponse>();
    const [wins, setWins] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const toastId = toast.loading("Načítání profilu...");

        Promise.all([
            userService.getPublicProfile(Number(userId)),
            userService.getPublicWins(Number(userId))
        ])
            .then(([profileData, winsData]) => {
                setProfile(profileData);
                setWins(winsData);
                toast.dismiss(toastId);
            })
            .catch(() => {
                toast.error("Nepodařilo se načíst profil uživatele.", { id: toastId });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";

    return (
        <Page>
            <Hero navbarTextColor="light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20 min-h-[60vh] flex flex-col justify-center gap-12 md:gap-16">
                    {!loading && !profile && (
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight m-0">
                            Uživatel nenalezen
                        </h1>
                    )}

                    {profile && (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-pink-200 rounded-full flex items-center justify-center">
                                    <span className="text-3xl md:text-5xl font-black text-pink-700">
                                        {profile.first_name.charAt(0)}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight m-0 break-words">
                                        {fullName}
                                    </h1>
                                    {profile.username && (
                                        <div className="mt-2 text-gray-300 text-lg">@{profile.username}</div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                                <ProfileStat
                                    label="Vyhrané aukce"
                                    value={profile.won_auctions_count.toLocaleString('cs-CZ')}
                                />
                                <ProfileStat
                                    label="Celkem přispěl/a"
                                    value={profile.total_paid.toLocaleString('cs-CZ')}
                                    unit="Kč"
                                />
                            </div>
                        </>
                    )}
                </div>
            </Hero>

            {profile && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
                    <h3 className="text-2xl font-black text-slate-900 uppercase m-0 tracking-tight border-b border-gray-200 pb-4">
                        Vyhrané aukce
                    </h3>

                    {wins.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
                            <p className="text-slate-500 font-medium m-0">Uživatel zatím nevyhrál žádnou aukci.</p>
                        </div>
                    ) : (
                        <AuctionContainer auctions={wins} />
                    )}
                </div>
            )}
            <OrganizationsBand variant="footer"/>
        </Page>
    );
}
