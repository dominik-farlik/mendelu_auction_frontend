import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import UserPage from "../profile/UserPage.tsx";
import ActionButton from "../buttons/ActionButton.tsx";
import OrganizationForm from "./OrganizationForm.tsx";
import { type OrganizationResponse, organizationService } from "../../api/organizationService.ts";
import { getApiErrorMessage } from "../../utils/apiError.ts";

export default function Organizations() {
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const toastId = toast.loading("Načítání organizací...");

        organizationService.getAll()
            .then((data) => {
                setOrganizations(data);
                toast.dismiss(toastId);
            })
            .catch(() => toast.error("Nepodařilo se načíst organizace.", { id: toastId }))
            .finally(() => setLoading(false));
    }, []);

    const handleCreated = (organization: OrganizationResponse) => {
        setOrganizations((prev) => [...prev, organization]);
        setShowCreate(false);
    };

    const handleUpdated = (organization: OrganizationResponse) => {
        setOrganizations((prev) => prev.map((o) => o.id === organization.id ? organization : o));
        setEditingId(null);
    };

    const handleDelete = async (organization: OrganizationResponse) => {
        if (!window.confirm(`Opravdu chcete smazat organizaci „${organization.name}“?`)) return;

        const toastId = toast.loading("Mažu organizaci...");
        try {
            await organizationService.deleteOrganization(organization.id);
            setOrganizations((prev) => prev.filter((o) => o.id !== organization.id));
            toast.success("Organizace byla smazána.", { id: toastId });
        } catch (err) {
            const errorMsg = getApiErrorMessage(err, "Nepodařilo se smazat organizaci.");
            toast.error(errorMsg, { id: toastId });
        }
    };

    return (
        <UserPage currentWindow="organizace">
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight m-0">Organizace</h2>
                    {!showCreate && (
                        <ActionButton
                            title="Přidat organizaci"
                            size="medium"
                            onClick={() => {
                                setShowCreate(true);
                                setEditingId(null);
                            }}
                        />
                    )}
                </div>

                {showCreate && (
                    <OrganizationForm
                        onSaved={handleCreated}
                        onCancel={() => setShowCreate(false)}
                    />
                )}

                {!loading && organizations.length === 0 && !showCreate && (
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
                        <span className="text-slate-500 font-medium">Zatím nebyla vytvořena žádná organizace.</span>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {organizations.map((organization) => (
                        editingId === organization.id ? (
                            <OrganizationForm
                                key={organization.id}
                                organization={organization}
                                onSaved={handleUpdated}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div
                                key={organization.id}
                                className="bg-white border border-slate-200 rounded-2xl p-4 md:px-6 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-slate-300 hover:shadow-md"
                            >
                                <div className="w-14 h-14 shrink-0 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
                                    {organization.logo ? (
                                        <img
                                            src={`${import.meta.env.VITE_IMAGES_URL}/${organization.logo}`}
                                            alt={organization.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-black text-pink-700">
                                            {organization.name.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col min-w-0 flex-1">
                                    <Link
                                        to={`/organizace/${organization.id}`}
                                        className="text-slate-900 font-bold truncate hover:underline underline-offset-4"
                                        title={organization.name}
                                    >
                                        {organization.name}
                                    </Link>
                                    <span className="text-sm text-slate-500 line-clamp-2">
                                        {organization.description || <span className="italic text-slate-400">bez popisu</span>}
                                    </span>
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => {
                                            setEditingId(organization.id);
                                            setShowCreate(false);
                                        }}
                                        className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                    >
                                        Upravit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(organization)}
                                        className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                    >
                                        Smazat
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </UserPage>
    );
}
