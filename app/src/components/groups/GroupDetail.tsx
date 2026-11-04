import Navbar from "../navbar/Navbar.tsx";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { type GroupResponse, groupService } from "../../api/groupService.ts";
import { type ProductResponse, productService } from "../../api/productService.ts";
import UserPageMenu from "../profile/UserPageMenu.tsx";
import AddMember from "./AddMember.tsx";
import ActionButton from "../buttons/ActionButton.tsx";
import CreatedAuctions from "../auction/CreatedAuctions.tsx";
import LinkButton from "../buttons/LinkButton.tsx";
import UserList from "../users/UserList.tsx";
import FinishedAuctions from "../auction/FinishedAuctions.tsx";
import { type OrganizationResponse, organizationService } from "../../api/organizationService.ts";
import { useAuth } from "../../context/useAuth.ts";
import { Role } from "../../types/user.ts";

export default function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<GroupResponse>();
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);
    const [showAddMember, setShowAddMember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [editingOrganization, setEditingOrganization] = useState<boolean>(false);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");
    const [savingOrganization, setSavingOrganization] = useState<boolean>(false);
    const { user } = useAuth();

    const canEditOrganization = user?.role.name === Role.Manager;

    useEffect(() => {
        const toastId = toast.loading("Načítání detailu skupiny...");

        Promise.all([
            groupService.getGroupDetail(Number(groupId)),
            productService.getGroupProducts(Number(groupId))
        ])
            .then(([groupData, productsData]) => {
                setGroup(groupData);
                setAuctions(productsData);
                toast.dismiss(toastId);
            })
            .catch(() => {
                toast.error("Nepodařilo se načíst data skupiny.", { id: toastId });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [groupId]);

    const startEditingOrganization = () => {
        setSelectedOrganizationId(group?.organization_id ? String(group.organization_id) : "");
        setEditingOrganization(true);

        if (organizations.length === 0) {
            organizationService.getAll()
                .then(setOrganizations)
                .catch(() => toast.error("Nepodařilo se načíst organizace."));
        }
    };

    const handleSaveOrganization = async () => {
        setSavingOrganization(true);
        const toastId = toast.loading("Ukládám organizaci skupiny...");

        try {
            const updatedGroup = await groupService.updateGroupOrganization(
                Number(groupId),
                selectedOrganizationId ? Number(selectedOrganizationId) : null
            );
            setGroup(updatedGroup);
            setEditingOrganization(false);
            toast.success("Organizace skupiny byla změněna.", { id: toastId });
        } catch {
            toast.error("Nepodařilo se změnit organizaci skupiny.", { id: toastId });
        } finally {
            setSavingOrganization(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grow">
                <UserPageMenu currentWindow={"skupiny"} />

                <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
                    {!loading && group && (
                        <div className="flex flex-col gap-10">

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                    {group.name}
                                </h2>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Organizace</span>
                                        {canEditOrganization && !editingOrganization && (
                                            <button
                                                onClick={startEditingOrganization}
                                                className="text-[11px] font-bold text-[#16a34a] hover:text-slate-900 uppercase tracking-wider transition-colors cursor-pointer"
                                            >
                                                Změnit
                                            </button>
                                        )}
                                    </div>

                                    {editingOrganization ? (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <select
                                                value={selectedOrganizationId}
                                                onChange={(e) => setSelectedOrganizationId(e.target.value)}
                                                className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 font-medium outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] transition-all shadow-sm cursor-pointer"
                                            >
                                                <option value="">Bez organizace</option>
                                                {organizations.map((organization) => (
                                                    <option key={organization.id} value={organization.id}>
                                                        {organization.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={handleSaveOrganization}
                                                    disabled={savingOrganization}
                                                    className="px-4 py-1.5 bg-[#4ade80] text-slate-900 hover:bg-[#22c55e] rounded-lg text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    {savingOrganization ? "Ukládám..." : "Uložit"}
                                                </button>
                                                <button
                                                    onClick={() => setEditingOrganization(false)}
                                                    className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                                >
                                                    Zrušit
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-slate-900 font-medium">
                                            {group.organization ? (
                                                <Link to={`/organizace/${group.organization.id}`} className="hover:underline underline-offset-4">
                                                    {group.organization.name}
                                                </Link>
                                            ) : <span className="text-slate-400 italic">nezadáno</span>}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Manažer</span>
                                    <span className="text-slate-900 font-medium">
                                        {group.manager.first_name} {group.manager.last_name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-4 relative">
                                    <h3 className="text-lg font-bold text-slate-800">Členové skupiny</h3>
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

                                <UserList users={group.members} />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Vytvořené nabídky</h3>
                                    <LinkButton
                                        title="Vytvořit aukci"
                                        link={`/vytvorit-aukci/${groupId}`}
                                        size="medium"
                                    />
                                </div>
                                <CreatedAuctions auctions={auctions} />
                                <h3 className="text-lg font-bold text-slate-800">Ukončené nabídky</h3>
                                <FinishedAuctions groupId={group.id} />
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}