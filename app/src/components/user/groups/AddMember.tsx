import React, { useState } from "react";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import SubmitButton from "../../buttons/SubmitButton.tsx";
import { groupService } from "../../../api/groupService.ts";

type AddMemberProps = {
    groupId: number;
}

export default function AddMember({ groupId }: AddMemberProps) {
    const [email, setEmail] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            toast.error("Vyplňte prosím e-mail člena.");
            return;
        }

        setSaving(true);

        const addPromise = groupService.addGroupMember(groupId, { email })
            .then(() => {
                setEmail("");
                // Vrácená zpráva se zobrazí v toast.promise(..., { success: ... })
                return "Nový člen byl úspěšně přidán.";
            });

        await toast.promise(addPromise, {
            loading: "Přidávám člena...",
            success: (msg) => msg,
            error: (err) => {
                const axiosError = err as AxiosError<{ detail?: string }>;
                const errorMsg = axiosError.response?.data?.detail || "Chyba při přidávání člena skupiny.";
                return typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            }
        }).finally(() => {
            setSaving(false);
        });
    };

    const inputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] focus:bg-white transition-all shadow-sm text-sm";
    const labelClasses = "text-sm font-bold text-slate-600 pl-1";

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-3xl shadow-xl border border-slate-200 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="member_email" className={labelClasses}>
                    E-mail člena*
                </label>
                <input
                    id="member_email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="např. jan.novak@email.cz"
                    className={inputClasses}
                />
            </div>

            <div className="flex justify-end mt-2">
                <SubmitButton
                    title={saving ? "Přidávám..." : "Přidat"}
                    size="medium"
                    disabled={saving || !email}
                />
            </div>
        </form>
    );
}