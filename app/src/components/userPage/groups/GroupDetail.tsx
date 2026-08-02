import Navbar from "../../navbar/Navbar.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {type GroupResponse, groupService} from "../../../api/groupService.ts";
import CreateButton from "../../CreateButton.tsx";
import List from "../../List.tsx";
import UserPageMenu from "../UserPageMenu.tsx";

export default function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<GroupResponse>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        groupService.getGroupDetail(Number(groupId))
            .then((data) => {
                setGroup(data);
            })
            .catch(() => {
                setError("Nepodařilo se načíst skupinu.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [groupId])

    return (
        <div className="page">
            <Navbar />

            <div className="user-page">
                <UserPageMenu currentWindow={"skupiny"} />

                {error && <div className="alert-error">{error}</div>}
                {loading && <div className="alert-info">Načítání informací o skupině</div>}

                {group &&
                    <div className="user-page-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span className="user-page-title">{group.name}</span>
                            <div style={ { display: "flex", justifyContent: "end", gap: "10px" }}>
                                <CreateButton
                                    title="Vytvořit aukci"
                                    link={`/vytvorit-aukci/${groupId}`}
                                    size="medium"
                                />
                                <CreateButton
                                    title="Přidat člena"
                                    link={`/pridat-clena/${groupId}`}
                                    size="medium"
                                />
                            </div>
                        </div>

                        <div className="user-page-content-container">
                            {loading ? (
                                <div className="alert-info">Načítání skupin...</div>
                            ) : error ? (
                                <div className="alert-error">{error}</div>
                            ) : (
                                <div className="user-page-items">
                                    <span>Organizace: {group.organization}</span>
                                    <span>Manažer: {group.manager.first_name} {group.manager.last_name}</span>
                                    <span>Členové:</span>
                                    <List items={group.members}
                                          renderItem={(member) => (
                                              <>
                                                  <div className="item-col">{member.first_name} {member.last_name}</div>
                                              </>
                                          )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}