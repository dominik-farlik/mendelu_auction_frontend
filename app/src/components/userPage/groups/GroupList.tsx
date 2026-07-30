import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type GroupResponse, groupService } from "../../../api/groupService.ts";
import { formatDate } from "../../../helperFunctions/formatDate.ts";

type GroupListProps = {
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
};

export default function GroupList({ setError, setLoading }: GroupListProps) {
    const [groups, setGroups] = useState<Array<GroupResponse>>([]);

    useEffect(() => {
        groupService.getCurrentUserGroups()
            .then((data) => {
                setGroups(data);
            })
            .catch((err) => {
                console.error("Chyba při načítání skupin:", err);
                setError("Nepodařilo se načíst vaše skupiny.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setError, setLoading]);

    return (
        <>
            {groups.length === 0 ? (
                <div className="alert-info">Zatím nejste členem žádné skupiny.</div>
            ) : (
                <>
                    <div className="list-container">
                        <div className="list-header bold-text desktop-header">
                            <div className="item-col-fr">Název</div>
                            <div className="item-col-fr">Organizace</div>
                            <div className="item-col-fr">Datum vytvoření</div>
                            <div className="item-col-fr">Správce</div>
                        </div>

                        {groups.map((group) => (
                            <Link to={`/skupina/${group.id}`} key={group.id} style={{ textDecoration: "none", color: "inherit" }}>
                                <div className="list-item">
                                    <div className="item-col" data-label="Název:">
                                        <strong>{group.name}</strong>
                                    </div>
                                    <div className="item-col" data-label="Organizace:">
                                        {group.organization ? (
                                            <span>{group.organization}</span>
                                        ) : (
                                            <span className="gray-italic-text">nezadáno</span>
                                        )}
                                    </div>
                                    <div className="item-col" data-label="Datum vytvoření:">
                                        {formatDate(group.created_at)}
                                    </div>
                                    <div className="item-col" data-label="Správce:">
                                        {`${group.manager.first_name} ${group.manager.last_name}`}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}