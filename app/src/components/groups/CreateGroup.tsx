import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { type GroupCreate, groupService } from "../../api/groupService.ts";
import SubmitButton from "../buttons/SubmitButton.tsx";
import UserPage from "../profile/UserPage.tsx";
import { type OrganizationResponse, organizationService } from "../../api/organizationService.ts";

export default function CreateGroup() {
    const [group, setGroup] = useState<GroupCreate>({
        name: "",
        organization_id: null,
    });
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [creating, setCreating] = useState<boolean>(false);

    useEffect(() => {
        organizationService.getAll()
            .then(setOrganizations)
            .catch(() => toast.error("Nepodařilo se načíst organizace."));
    }, []);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGroup((prev) => ({ ...prev, [name]: value }));
    };

    const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setGroup((prev) => ({ ...prev, organization_id: value ? Number(value) : null }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!group.name) {
            toast.error("Vyplňte prosím název skupiny.");
            return;
        }

        setCreating(true);

        const createPromise = groupService.createGroup({
            name: group.name,
            organization_id: group.organization_id ?? null,
        }).then(() => {
            // Po úspěšném vytvoření přesměrujeme uživatele zpět na výpis skupin
            navigate("/profil/skupiny");
            return "Skupina byla úspěšně vytvořena.";
        });

        await toast.promise(createPromise, {
            loading: "Vytvářím skupinu...",
            success: (msg) => msg,
            error: (err) => {
                const axiosError = err as AxiosError<{ detail?: string }>;
                const errorMsg = axiosError.response?.data?.detail || "Chyba při vytváření skupiny.";
                return typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            }
        }).finally(() => {
            setCreating(false);
        });
    };

    const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] focus:bg-white transition-all shadow-sm";
    const labelClasses = "text-sm font-bold text-slate-600 pl-1";

    return (
        <UserPage currentWindow="skupiny">
            <div className="flex flex-col h-full">
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">
                    Vytvořit novou skupinu
                </h2>

                <div className="flex flex-col gap-6 grow">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 grow">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5 w-full">
                                <label htmlFor="name" className={labelClasses}>
                                    Název skupiny*
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={group.name}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 w-full">
                                <label htmlFor="organization" className={labelClasses}>
                                    Organizace
                                </label>
                                <select
                                    id="organization"
                                    name="organization_id"
                                    value={group.organization_id ?? ""}
                                    onChange={handleOrganizationChange}
                                    className={`${inputClasses} cursor-pointer`}
                                >
                                    <option value="">Bez organizace</option>
                                    {organizations.map((organization) => (
                                        <option key={organization.id} value={organization.id}>
                                            {organization.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 mt-auto border-t border-slate-100">
                            <SubmitButton
                                title={creating ? "Vytvářím..." : "Vytvořit"}
                                size="medium"
                                disabled={creating || !group.name}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </UserPage>
    );
}