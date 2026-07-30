import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { type GroupResponse, groupService } from "../../../api/groupService.ts";
import {formatDate} from "../../../helperFunctions/formatDate.ts";

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
                    <div className="bold-text" style={{ display: "flex", justifyContent: "space-between" }}>
                        <div className="item-col-fr">Název</div>
                        <div className="item-col-fr">Organizace</div>
                        <div className="item-col-fr">Datum vytvoření</div>
                        <div className="item-col-fr">Manažer</div>
                    </div>
                    <div className="list-container">
                        {groups.map((group) => (
                            <Link to={`/skupiny/${group.id}`} key={group.id} style={{ textDecoration: "none", color: "inherit" }}>
                            <div className="list-item">
                                <div className="item-col">{group.name}</div>
                                {group.organization ?
                                    (<div className="item-col">{group.organization}</div>) :
                                    (<div className="item-col gray-italic-text">nezadáno</div>)}
                                <div className="item-col">{formatDate(group.created_at)}</div>
                                <div className="item-col">{`${group.manager.first_name} ${group.manager.last_name}`}</div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}