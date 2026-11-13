import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type OrganizationResponse, organizationService } from "../api/organizationService.ts";

type OrganizationsBandProps = {
    /** "band" = pás na hlavní stránce, "footer" = patička ostatních veřejných stránek. */
    variant?: "band" | "footer";
};

const HEADING = "Výtěžek ze všech aukcí bude rovnoměrně rozdělen mezi tyto subjekty a organizace:";

// Seznam organizací se mezi stránkami nemění, stačí ho načíst jednou za návštěvu.
let organizationsCache: Promise<OrganizationResponse[]> | null = null;

/** Po úpravě organizací v administraci, aby se na webu hned ukázaly nové texty a loga. */
// eslint-disable-next-line react-refresh/only-export-components
export function invalidateOrganizationsCache() {
    organizationsCache = null;
}

function loadOrganizations(): Promise<OrganizationResponse[]> {
    if (!organizationsCache) {
        organizationsCache = organizationService.getAll().catch((err) => {
            organizationsCache = null;
            throw err;
        });
    }
    return organizationsCache;
}

function OrganizationCard({ organization }: { organization: OrganizationResponse }) {
    const title = organization.beneficiary_name || organization.name;
    return (
        <Link
            to={`/organizace/${organization.id}`}
            className="group flex flex-col items-center text-center gap-3 p-4 rounded-3xl hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80]/60 transition-colors h-full"
        >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105">
                {organization.logo ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGES_URL}/${organization.logo}`}
                        alt={organization.name}
                        className="w-full h-full object-contain p-3"
                    />
                ) : (
                    <span className="text-3xl font-black text-slate-700">{organization.name.charAt(0)}</span>
                )}
            </div>

            <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-white leading-snug">{title}</span>
                {organization.beneficiary_name && (
                    <span className="text-xs font-semibold text-slate-400 leading-snug">{organization.name}</span>
                )}
            </div>

            {organization.short_description && (
                <p className="text-sm text-slate-300 leading-relaxed m-0 line-clamp-4">
                    {organization.short_description}
                </p>
            )}

            <span className="mt-auto text-sm font-bold text-[#4ade80] flex items-center gap-1 group-hover:gap-2 transition-all">
                Více o podpoře
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </span>
        </Link>
    );
}

export default function OrganizationsBand({ variant = "footer" }: OrganizationsBandProps) {
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);

    useEffect(() => {
        let active = true;
        loadOrganizations()
            .then((data) => active && setOrganizations(data))
            .catch(() => active && setOrganizations([]));
        return () => {
            active = false;
        };
    }, []);

    if (organizations.length === 0) {
        return null;
    }

    // Mřížka karet: na telefonu pod sebou, na tabletu po dvou, na desktopu až čtyři vedle sebe.
    const columns = organizations.length >= 4 ? "lg:grid-cols-4" : organizations.length === 3 ? "lg:grid-cols-3" : "";
    const logos = (
        <div className={`w-full grid grid-cols-1 sm:grid-cols-2 ${columns} gap-4 md:gap-6 max-w-6xl`}>
            {organizations.map((organization) => (
                <OrganizationCard key={organization.id} organization={organization} />
            ))}
        </div>
    );

    if (variant === "band") {
        return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 relative z-10">
                <div className="px-6 py-8 md:px-12 md:py-10 flex flex-col items-center gap-7">
                    <h2 className="text-base md:text-lg font-semibold text-white text-center leading-snug m-0">
                        {HEADING}
                    </h2>
                    {logos}
                </div>
            </section>
        );
    }

    return (
        <footer className="bg-slate-900 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col items-center gap-10">
                <h2 className="text-lg md:text-xl font-bold text-white text-center max-w-3xl leading-snug m-0">
                    {HEADING}
                </h2>
                {logos}
            </div>
        </footer>
    );
}
