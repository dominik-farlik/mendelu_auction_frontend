import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../Page.tsx";
import Hero from "../Hero.tsx";
import LinkButton from "../buttons/LinkButton.tsx";
import OrganizationsBand from "../OrganizationsBand.tsx";
import { type OrganizationResponse, organizationService } from "../../api/organizationService.ts";

/** Veřejná stránka podporované organizace: komu výtěžek pomůže a celý popis (bez finančních údajů). */
export default function OrganizationProfile() {
    const { organizationId } = useParams<{ organizationId: string }>();
    const [organization, setOrganization] = useState<OrganizationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let active = true;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        organizationService.getOrganization(Number(organizationId))
            .then((data) => active && setOrganization(data))
            .catch(() => active && setOrganization(null))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, [organizationId]);

    const title = organization?.beneficiary_name || organization?.name;
    const description = organization?.description?.trim() || organization?.short_description?.trim();

    return (
        <Page>
            <Hero navbarTextColor="light">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-16 flex flex-col gap-10 md:gap-12">
                    {loading && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 animate-pulse">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-white/10 shrink-0"></div>
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="h-10 md:h-14 w-3/4 rounded-xl bg-white/10"></div>
                                <div className="h-5 w-1/2 rounded-lg bg-white/10"></div>
                            </div>
                        </div>
                    )}

                    {!loading && !organization && (
                        <div className="flex flex-col gap-6 items-start">
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight m-0">
                                Organizace nenalezena
                            </h1>
                            <LinkButton title="Zpět na aukce" link="/" size="large" />
                        </div>
                    )}

                    {!loading && organization && (
                        <>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-10">
                            <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-3xl bg-white flex items-center justify-center overflow-hidden shadow-2xl">
                                {organization.logo ? (
                                    <img
                                        src={`${import.meta.env.VITE_IMAGES_URL}/${organization.logo}`}
                                        alt={organization.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <span className="text-4xl md:text-5xl font-black text-slate-700">
                                        {organization.name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 min-w-0">
                                <span className="flex items-center gap-2 text-xs font-bold text-[#4ade80] uppercase tracking-[0.2em]">
                                    <span className="w-6 h-0.5 bg-[#4ade80] rounded-full"></span>
                                    Podporujeme
                                </span>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight m-0 break-words">
                                    {title}
                                </h1>
                                {organization.beneficiary_name && (
                                    <p className="text-base md:text-lg font-semibold text-slate-300 m-0">
                                        {organization.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 max-w-3xl">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider m-0">
                                Komu výtěžek pomůže
                            </h2>
                            {description ? (
                                <p className="text-lg md:text-xl text-slate-200 leading-relaxed m-0 whitespace-pre-wrap">
                                    {description}
                                </p>
                            ) : (
                                <p className="text-lg text-slate-400 italic m-0">Popis zatím nebyl doplněn.</p>
                            )}
                        </div>

                        <div className="max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
                            <p className="text-slate-300 leading-relaxed m-0">
                                Výtěžek ze všech zaplacených aukcí Dobrotrhu se rovnoměrně rozdělí mezi všechny podporované
                                organizace. Každým příhozem tak pomáháte i zde.
                            </p>
                            <div className="shrink-0">
                                <LinkButton title="Prohlédnout aukce" link="/" size="large" />
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </Hero>

            <OrganizationsBand variant="footer" />
        </Page>
    );
}
