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

function OrganizationLogo({ organization, dark }: { organization: OrganizationResponse; dark: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3 w-36 sm:w-44">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-slate-200">
                {organization.logo ? (
                    <img
                        src={`${import.meta.env.VITE_IMAGES_URL}/${organization.logo}`}
                        alt={organization.name}
                        className="w-full h-full object-contain p-4"
                    />
                ) : (
                    <span className="text-4xl font-black text-slate-700">{organization.name.charAt(0)}</span>
                )}
            </div>
            <span className={`text-sm font-bold text-center leading-snug ${dark ? "text-slate-200" : "text-slate-700"}`}>
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
                <OrganizationLogo key={organization.id} organization={organization} dark={variant === "footer"} />
            ))}
        </div>
    );

    if (variant === "band") {
        return (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm px-6 py-10 md:px-12 md:py-12 flex flex-col items-center gap-10">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight text-center max-w-3xl leading-snug m-0">
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
