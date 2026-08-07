import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { type GroupResponse, groupService } from "../../../api/groupService.ts";
import { formatDate } from "../../../utils/formatDate.ts";

export default function GroupList() {
    const [groups, setGroups] = useState<Array<GroupResponse>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const toastId = toast.loading("Načítání skupin...");

        groupService.getCurrentUserGroups()
            .then((data) => {
                setGroups(data);
                toast.dismiss(toastId);

                if (data.length === 0) {
                    toast("Zatím nejste členem žádné skupiny.", { icon: "ℹ️" });
                }
            })
            .catch((err) => {
                console.error("Chyba při načítání skupin:", err);
                toast.error("Nepodařilo se načíst vaše skupiny.", { id: toastId });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Během načítání nebo při prázdném poli neukazujeme nic, vše řeší toast
    if (loading || groups.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Desktopová hlavička */}
            <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 md:justify-items-center">
                <div>Název</div>
                <div>Organizace</div>
                <div>Datum vytvoření</div>
                <div>Správce</div>
                <div>Počet členů</div>
            </div>

            {/* Výpis skupin */}
            <div className="flex flex-col gap-3">
                {groups.map((group) => (
                    <Link
                        to={`/skupina/${group.id}`}
                        key={group.id}
                        className="group block outline-none focus:ring-4 focus:ring-[#4ade80]/20 rounded-2xl"
                    >
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:px-6 md:py-4 transition-all hover:border-[#4ade80] hover:shadow-md grid grid-cols-2 md:grid-cols-5 gap-4 md:items-center md:justify-items-center">

                            {/* Název */}
                            <div className="flex flex-col md:block">
                                <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Název</span>
                                <strong className="text-slate-900 font-bold group-hover:text-[#4ade80] transition-colors">
                                    {group.name}
                                </strong>
                            </div>

                            {/* Organizace */}
                            <div className="flex flex-col md:block">
                                <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Organizace</span>
                                {group.organization ? (
                                    <span className="text-slate-700 font-medium">{group.organization}</span>
                                ) : (
                                    <span className="text-slate-400 italic font-medium">nezadáno</span>
                                )}
                            </div>

                            {/* Datum vytvoření */}
                            <div className="flex flex-col md:block">
                                <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Datum vytvoření</span>
                                <span className="text-slate-700 font-medium">{formatDate(group.created_at)}</span>
                            </div>

                            {/* Správce */}
                            <div className="flex flex-col md:block">
                                <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Správce</span>
                                <span className="text-slate-700 font-medium">
                                    {`${group.manager.first_name} ${group.manager.last_name}`}
                                </span>
                            </div>

                            {/* Členové */}
                            <div className="flex flex-col md:block">
                                <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Počet členů</span>
                                <span className="text-slate-700 font-medium">
                                    {group.members.length}
                                </span>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}