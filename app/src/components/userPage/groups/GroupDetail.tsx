import Navbar from "../../navbar/Navbar.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type GroupResponse, groupService } from "../../../api/groupService.ts";
import {type ProductResponse, productService} from "../../../api/productService.ts";
import LinkButton from "../../LinkButton.tsx";
import List from "../../List.tsx";
import UserPageMenu from "../UserPageMenu.tsx";
import AddMember from "./AddMember.tsx";
import ActionButton from "../../ActionButton.tsx";

export default function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<GroupResponse>();
    const [products, setProducts] = useState<ProductResponse[]>([]); // Nový stav pro produkty
    const [showAddMember, setShowAddMember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            groupService.getGroupDetail(Number(groupId)),
            productService.getGroupProducts(Number(groupId))
        ])
            .then(([groupData, productsData]) => {
                setGroup(groupData);
                setProducts(productsData);
            })
            .catch(() => {
                setError("Nepodařilo se načíst data skupiny.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [groupId]);

    return (
        <div className="page">
            <Navbar />

            <div className="user-page">
                <UserPageMenu currentWindow={"skupiny"} />

                {successMessage && <div className="alert-success">{successMessage}</div>}
                {error && <div className="alert-error">{error}</div>}

                {group &&
                    <div className="user-page-content">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="user-page-title">{group.name}</div>
                            <div style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
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
                                {showAddMember &&
                                    <AddMember
                                        groupId={Number(groupId)}
                                        setSaving={setLoading}
                                        setSuccessMessage={setSuccessMessage}
                                        setError={setError}
                                    />
                                }
                            </div>
                        </div>

                        <div className="user-page-content-container">
                            {loading ? (
                                <div className="alert-info">Načítání skupiny...</div>
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

                                    {/* Nový výpis produktů pod sebou */}
                                    <span style={{ marginTop: "20px", display: "block" }}>Produkty:</span>
                                    <List items={products}
                                          renderItem={(product) => (
                                              <>
                                                  <div className="item-col"><strong>{product.title}</strong></div>
                                                  <div className="item-col">Vyvolávací cena: {product.starting_price} Kč</div>
                                                  <div className="item-col">Stav: {product.status}</div>
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