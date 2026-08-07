import Navbar from "../../navbar/Navbar.tsx";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { type GroupResponse, groupService } from "../../../api/groupService.ts";
import { type ProductResponse, productService } from "../../../api/productService.ts";
import LinkButton from "../../buttons/LinkButton.tsx";
import UserPageMenu from "../UserPageMenu.tsx";
import AddMember from "./AddMember.tsx";
import ActionButton from "../../buttons/ActionButton.tsx";
import type { UserResponse } from "../../../api/userService.ts";

// Import vaší pomocné funkce
import { parseTimeDistance } from "../../../utils/formatDate.ts";

export default function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<GroupResponse>();
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [showAddMember, setShowAddMember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const toastId = toast.loading("Načítání detailu skupiny...");

        Promise.all([
            groupService.getGroupDetail(Number(groupId)),
            productService.getGroupProducts(Number(groupId))
        ])
            .then(([groupData, productsData]) => {
                setGroup(groupData);
                setProducts(productsData);
                toast.dismiss(toastId);
            })
            .catch(() => {
                toast.error("Nepodařilo se načíst data skupiny.", { id: toastId });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [groupId]);

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return { className: "bg-[#4ade80]/20 text-[#16a34a]", label: "Schváleno" };
            case "pending":
                return { className: "bg-amber-100 text-amber-700", label: "Čekající" };
            case "cancelled":
            case "canceled":
                return { className: "bg-red-100 text-red-700", label: "Zrušeno" };
            default:
                return { className: "bg-slate-100 text-slate-700", label: status };
        }
    };

    // Nová funkce pro výpočet a formátování času
    const getTimeUntilStart = (startsAt: string) => {
        const distance = new Date(startsAt).getTime() - new Date().getTime();

        // Pokud už čas vypršel
        if (distance <= 0) {
            return "Již začalo";
        }

        const { days, hours, minutes } = parseTimeDistance(distance);

        const parts = [];
        if (days > 0) parts.push(`${days} d`);
        if (hours > 0) parts.push(`${hours} h`);
        if (minutes > 0 || parts.length === 0) parts.push(`${minutes} m`); // Zobrazí minuty i když je to 0m (pokud je to < 1 min)

        return `Za ${parts.join(" ")}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grow">
                <UserPageMenu currentWindow={"skupiny"} />

                <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
                    {!loading && group && (
                        <div className="flex flex-col gap-10">

                            {/* Hlavička */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                    {group.name}
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-3 relative">
                                    <LinkButton
                                        title="Vytvořit aukci"
                                        link={`/vytvorit-aukci/${groupId}`}
                                        size="medium"
                                    />
                                    <ActionButton
                                        title="Přidat člena"
                                        size="medium"
                                        cursor="pointer"
                                        onClick={() => setShowAddMember(!showAddMember)}
                                    />

                                    {showAddMember && (
                                        <div className="absolute right-0 top-full mt-3 z-10 w-full sm:w-auto min-w-70">
                                            <AddMember
                                                groupId={Number(groupId)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info o skupině */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Organizace</span>
                                    <span className="text-slate-900 font-medium">
                                        {group.organization || <span className="text-slate-400 italic">nezadáno</span>}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Manažer</span>
                                    <span className="text-slate-900 font-medium">
                                        {group.manager.first_name} {group.manager.last_name}
                                    </span>
                                </div>
                            </div>

                            {/* Členové skupiny */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-slate-800">Členové skupiny</h3>

                                {!group.members || group.members.length === 0 ? (
                                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
                                        <span className="text-slate-500 font-medium">V této skupině zatím nejsou žádní další členové.</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {group.members.map((member: UserResponse, index) => (
                                            <div key={index} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 transition-all hover:border-slate-300">
                                                <div className="w-10 h-10 shrink-0 rounded-full bg-[#4ade80]/20 text-[#16a34a] flex items-center justify-center font-bold text-sm">
                                                    {member.first_name[0]}{member.last_name[0]}
                                                </div>
                                                <strong className="text-slate-700 truncate">
                                                    {member.first_name} {member.last_name}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Vytvořené nabídky */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-slate-800">Vytvořené nabídky</h3>

                                {products.length === 0 ? (
                                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
                                        <span className="text-slate-500 font-medium">Ve vaší skupině nebyla přidána žádná nabídka.</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {/* Přidán sloupec "Začátek" a změněno na grid-cols-4 */}
                                        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 md:justify-items-center">
                                            <div>Název</div>
                                            <div>Vyvolávací cena</div>
                                            <div>Začátek</div>
                                            <div>Stav</div>
                                        </div>

                                        {products.map(product => {
                                            const statusInfo = getStatusInfo(product.status);
                                            // Pro jistotu kontrolujeme, jestli backend vůbec poslal starts_at
                                            const timeUntil = product.starts_at ? getTimeUntilStart(product.starts_at) : "Není určen";

                                            return (
                                                <Link
                                                    to={`/aukce/detail/${product.id}`}
                                                    key={product.id}
                                                    className="group block outline-none focus:ring-4 focus:ring-[#4ade80]/20 rounded-2xl"
                                                >
                                                    {/* Změněno na grid-cols-4 */}
                                                    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:px-6 md:py-4 transition-all hover:border-[#4ade80] hover:shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 md:items-center md:justify-items-center">

                                                        <div className="flex flex-col md:block">
                                                            <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Název</span>
                                                            <strong className="text-slate-900 font-bold group-hover:text-[#4ade80] transition-colors truncate block">
                                                                {product.title}
                                                            </strong>
                                                        </div>

                                                        <div className="flex flex-col md:block">
                                                            <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Vyvolávací cena</span>
                                                            <span className="text-slate-700 font-medium">{product.starting_price} Kč</span>
                                                        </div>

                                                        <div className="flex flex-col md:block">
                                                            <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Začátek</span>
                                                            <span className={`font-medium ${timeUntil === "Již začalo" ? "text-[#16a34a]" : "text-slate-700"}`}>
                                                                {timeUntil}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col md:block items-start">
                                                            <span className="text-[11px] font-bold text-slate-400 md:hidden uppercase tracking-wider mb-1">Stav</span>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.className}`}>
                                                                {statusInfo.label}
                                                            </span>
                                                        </div>

                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}