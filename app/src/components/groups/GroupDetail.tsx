import Navbar from "../navbar/Navbar.tsx";
import {  useParams } from "react-router-dom";
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

export default function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<GroupResponse>();
    const [auctions, setAuctions] = useState<ProductResponse[]>([]);
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
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}