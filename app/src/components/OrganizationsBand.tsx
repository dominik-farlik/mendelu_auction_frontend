import { useEffect, useState } from "react";
import { type OrganizationResponse, organizationService } from "../api/organizationService.ts";

type OrganizationsBandProps = {
    /** "band" = výrazný pás na hlavní stránce, "footer" = patička ostatních veřejných stránek. */
    variant?: "band" | "footer";
};

const HEADING = "Výtěžek ze všech aukcí bude rovnoměrně rozdělen mezi tyto organizace:";

// Seznam organizací se mezi stránkami nemění, stačí ho načíst jednou za návštěvu.
let organizationsCache: Promise<OrganizationResponse[]> | null = null;

function loadOrganizations(): Promise<OrganizationResponse[]> {
    if (!organizationsCache) {
        organizationsCache = organizationService.getAll().catch((err) => {
            organizationsCache = null;
            throw err;
        });
    }
    return organizationsCache;
}

function OrganizationLogo({ organization, compact }: { organization: OrganizationResponse; compact: boolean }) {
    const tileSize = compact ? "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" : "w-28 h-28 sm:w-32 sm:h-32 rounded-3xl";
    return (
        <div className={`flex flex-col items-center gap-3 ${compact ? "w-28 sm:w-36" : "w-36 sm:w-44"}`}>
            <div className={`${tileSize} bg-white flex items-center justify-center overflow-hidden shadow-sm`}>
                {organization.logo ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGES_URL}/${organization.logo}`}
                        alt={organization.name}
                        className={`w-full h-full object-contain ${compact ? "p-3" : "p-4"}`}
                    />
                ) : (
                    <span className="text-3xl font-black text-slate-700">{organization.name.charAt(0)}</span>
                )}
            </div>
            <span className="text-sm font-semibold text-center leading-snug text-slate-200">
                {organization.name}
            </span>
        </div>
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

    const logos = (
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-12">
            {organizations.map((organization) => (
                <OrganizationLogo key={organization.id} organization={organization} compact={variant === "band"} />
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
