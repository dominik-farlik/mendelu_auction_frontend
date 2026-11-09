import React, { useState } from "react";
import toast from "react-hot-toast";
import SubmitButton from "../buttons/SubmitButton.tsx";
import {
    type OrganizationCreate,
    type OrganizationResponse,
    organizationService
} from "../../api/organizationService.ts";
import { getApiErrorMessage } from "../../utils/apiError.ts";

type OrganizationFormProps = {
    organization?: OrganizationResponse;
    onSaved: (organization: OrganizationResponse) => void;
    onCancel: () => void;
}

export default function OrganizationForm({ organization, onSaved, onCancel }: OrganizationFormProps) {
    const isEditMode = !!organization;
    const [formData, setFormData] = useState<OrganizationCreate>({
        name: organization?.name ?? "",
        description: organization?.description ?? "",
    });
    const [logo, setLogo] = useState<File | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Vyplňte prosím název organizace.");
            return;
        }

        setSaving(true);

        const payload: OrganizationCreate = {
            name: formData.name,
            description: formData.description,
        };

        const savePromise = (isEditMode
            ? organizationService.updateOrganization(organization.id, payload, logo)
            : organizationService.createOrganization(payload, logo)
        ).then((saved) => {
            onSaved(saved);
            return isEditMode ? "Organizace byla upravena." : "Organizace byla vytvořena.";
        });

        await toast.promise(savePromise, {
            loading: isEditMode ? "Ukládám organizaci..." : "Vytvářím organizaci...",
            success: (msg) => msg,
            error: (err) => {
                const errorMsg = getApiErrorMessage(err, "Chyba při ukládání organizace.");
                return errorMsg;
            }
        }).finally(() => {
            setSaving(false);
        });
    };

    const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] focus:bg-white transition-all shadow-sm";
    const labelClasses = "text-sm font-bold text-slate-600 pl-1";

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-5"
        >
            <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor={`organization_name_${organization?.id ?? "new"}`} className={labelClasses}>
                    Název organizace*
                </label>
                <input
                    id={`organization_name_${organization?.id ?? "new"}`}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor={`organization_description_${organization?.id ?? "new"}`} className={labelClasses}>
                    Popis
                </label>
                <textarea
                    id={`organization_description_${organization?.id ?? "new"}`}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputClasses} resize-y`}
                />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
                <label className={labelClasses}>Logo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:font-bold file:bg-[#4ade80]/20 hover:file:bg-[#4ade80]/30 transition-all cursor-pointer"
                />
                {isEditMode && <p className="text-xs text-slate-400 mt-1 pl-1">Ponechte prázdné, pokud nechcete měnit původní logo.</p>}
            </div>

            <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    Zrušit
                </button>
                <SubmitButton
                    title={saving ? "Ukládám..." : (isEditMode ? "Uložit" : "Vytvořit")}
                    size="medium"
                    disabled={saving || !formData.name}
                />
            </div>
        </form>
    );
}
