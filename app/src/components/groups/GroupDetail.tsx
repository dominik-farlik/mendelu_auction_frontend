import Navbar from "../navbar/Navbar.tsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GROUP_NAME_MAX, type GroupResponse, groupService } from "../../api/groupService.ts";
import { type ProductResponse, productService } from "../../api/productService.ts";
import UserPageMenu from "../profile/UserPageMenu.tsx";
import AddMember from "./AddMember.tsx";
import ActionButton from "../buttons/ActionButton.tsx";
import CreatedAuctions from "../auction/CreatedAuctions.tsx";
import LinkButton from "../buttons/LinkButton.tsx";
import UserList from "../users/UserList.tsx";
import type { UserResponse } from "../../api/userService.ts";
import FinishedAuctions from "../auction/FinishedAuctions.tsx";
import { type OrganizationResponse, organizationService } from "../../api/organizationService.ts";
import { useAuth } from "../../context/useAuth.ts";
import { Role } from "../../types/user.ts";
import { getApiErrorMessage } from "../../utils/apiError.ts";

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
    const [editingName, setEditingName] = useState<boolean>(false);
    const [nameDraft, setNameDraft] = useState<string>("");
    const [savingName, setSavingName] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const canEditOrganization = user?.role.name === Role.Manager;
    // Název změnit a skupinu smazat smí její správce nebo manažer (stejné pravidlo jako na backendu).
    const canAdministerGroup = canEditOrganization || (!!user && group?.manager.id === user.id);

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

    const startEditingName = () => {
        setNameDraft(group?.name ?? "");
        setEditingName(true);
    };

    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = nameDraft.trim();
        if (!name || name === group?.name) {
            setEditingName(false);
            return;
        }

        setSavingName(true);
        const toastId = toast.loading("Ukládám název skupiny...");
        try {
            const updatedGroup = await groupService.renameGroup(Number(groupId), name);
            setGroup(updatedGroup);
            setEditingName(false);
            toast.success("Název skupiny byl změněn.", { id: toastId });
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Nepodařilo se změnit název skupiny."), { id: toastId });
        } finally {
            setSavingName(false);
        }
    };

    const handleRemoveMember = async (member: UserResponse) => {
        if (!group) return;
        if (!window.confirm(`Opravdu chcete odebrat ${member.first_name} ${member.last_name} ze skupiny „${group.name}“?`)) return;

        const toastId = toast.loading("Odebírám člena...");
        try {
            await groupService.removeGroupMember(group.id, member.id);
            setGroup({ ...group, members: group.members.filter((m) => m.id !== member.id) });
            toast.success("Člen byl odebrán ze skupiny.", { id: toastId });
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Nepodařilo se odebrat člena."), { id: toastId });
        }
    };

    const handleDelete = async () => {
        if (!group) return;
        if (!window.confirm(
            `Opravdu chcete smazat skupinu „${group.name}“?\n\n` +
            "Členové ztratí přístup. Proběhlé aukce zůstanou zachované."
        )) return;

        setDeleting(true);
        const toastId = toast.loading("Mažu skupinu...");
        try {
            await groupService.deleteGroup(group.id);
            toast.success("Skupina byla smazána.", { id: toastId });
            navigate("/profil/skupiny");
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Nepodařilo se smazat skupinu."), { id: toastId, duration: 6000 });
            setDeleting(false);
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

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                {editingName ? (
                                    <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={nameDraft}
                                            onChange={(e) => setNameDraft(e.target.value)}
                                            maxLength={GROUP_NAME_MAX}
                                            autoFocus
                                            required
                                            aria-label="Název skupiny"
                                            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-900 text-lg font-bold rounded-xl px-4 py-2 outline-none focus:ring-4 focus:ring-[#4ade80]/20 focus:border-[#4ade80] transition-all shadow-sm"
                                        />
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                type="submit"
                                                disabled={savingName || !nameDraft.trim()}
                                                className="px-4 py-2 bg-[#4ade80] text-slate-900 hover:bg-[#22c55e] rounded-lg text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
                                            >
                                                {savingName ? "Ukládám..." : "Uložit"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingName(false)}
                                                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                            >
                                                Zrušit
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight break-words min-w-0 m-0">
                                        {group.name}
                                    </h2>
                                )}

                                {canAdministerGroup && !editingName && (
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={startEditingName}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                        >
                                            Přejmenovat
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {deleting ? "Mažu..." : "Smazat skupinu"}
                                        </button>
                                    </div>
                                )}
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
                                                onAdded={() => groupService.getGroupDetail(Number(groupId)).then(setGroup).catch(() => {})}
                                            />
                                        </div>
                                    )}
                                </div>

                                <UserList
                                    users={group.members}
                                    onRemove={canAdministerGroup ? handleRemoveMember : undefined}
                                    canRemove={(member) => member.id !== group.manager.id}
                                    removeLabel="Odebrat ze skupiny"
                                />
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