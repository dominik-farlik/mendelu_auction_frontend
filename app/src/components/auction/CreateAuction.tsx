import React, { useEffect, useState } from 'react';
import './CreateAuction.css';
import Navbar from "../navbar/Navbar.tsx";
import { useParams } from "react-router-dom";
import { type GroupResponse, groupService } from "../../api/groupService.ts";
import { type AxiosError } from "axios";
import { productService } from "../../api/productService.ts";
import {SaleType} from "../../types/product.ts";
import SubmitButton from "../SubmitButton.tsx";

export default function CreateAuction() {
    const { groupId } = useParams<{ groupId: string }>();
    const [groups, setGroups] = useState<Array<GroupResponse>>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sale_type: SaleType.Auction,
        big_preview: false,
        starting_price: '',
        buy_now_price: '',
        starts_at: '',
        ends_at: '',
        group_id: groupId ? Number(groupId) : '',
    });

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [additionalImages, setAdditionalImages] = useState<FileList | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const id = Number(groupId);

        groupService.getCurrentUserGroups()
            .then((userGroups) => {
                setGroups(userGroups);
                if (id) {
                    setFormData(prev => ({ ...prev, group_id: id }));
                }
            })
            .catch(() => {
                setError("Nepodařilo se načíst uživatelské skupiny.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [groupId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAdditionalImages(e.target.files);
        }
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const productPayload = {
            title: formData.title,
            description: formData.description || null,
            sale_type: formData.sale_type,
            big_preview: formData.big_preview,
            starting_price: parseFloat(formData.starting_price),
            buy_now_price: formData.buy_now_price ? parseFloat(formData.buy_now_price) : null,
            starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
            ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
            group_id: Number(formData.group_id),
        };

        try {
            await productService.createAuction(
                productPayload,
                coverImage,
                additionalImages
            );

            setSuccess(true);
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || "Při vytváření aukce došlo k chybě.";
            const strError = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            setError(strError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="create-auction-container">
                <h2 className="auction-title">Vytvořit novou aukci</h2>

                {error && <div className="auction-alert-error">{error}</div>}
                {success && <div className="auction-alert-success">Aukce byla úspěšně vytvořena!</div>}

                <form onSubmit={handleSubmit} className="auction-form">
                    <div className="auction-field">
                        <label className="auction-label">Skupina</label>
                        <select
                            name="group_id"
                            required
                            value={formData.group_id}
                            onChange={handleChange}
                            className="auction-input"
                        >
                            <option value="" disabled>Vyberte skupinu</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="auction-field">
                        <label className="auction-label">Název produktu</label>
                        <input
                            type="text"
                            name="title"
                            maxLength={100}
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="auction-input"
                        />
                    </div>

                    <div className="auction-field">
                        <label className="auction-label">Popis</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="auction-textarea"
                        />
                    </div>

                    <div className="auction-field">
                        <label className="auction-label">Typ prodeje</label>
                        <select
                            name="sale_type"
                            value={formData.sale_type}
                            onChange={handleChange}
                            className="auction-select"
                        >
                            <option value={SaleType.Auction}>Aukce</option>
                            <option value={SaleType.BuyNow}>Kup teď</option>
                            <option value={SaleType.Both}>Obojí</option>
                        </select>
                    </div>

                    <div className="auction-grid-2">
                        <div className="auction-field">
                            <label className="auction-label">Počáteční cena</label>
                            <input
                                type="number"
                                step="0.01"
                                name="starting_price"
                                required
                                value={formData.starting_price}
                                onChange={handleChange}
                                className="auction-input"
                            />
                        </div>
                        <div className="auction-field">
                            <label className="auction-label">Cena Kup teď (nepovinné)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="buy_now_price"
                                value={formData.buy_now_price}
                                onChange={handleChange}
                                className="auction-input"
                            />
                        </div>
                    </div>

                    <div className="auction-grid-2">
                        <div className="auction-field">
                            <label className="auction-label">Začátek aukce</label>
                            <input
                                type="datetime-local"
                                name="starts_at"
                                value={formData.starts_at}
                                onChange={handleChange}
                                className="auction-input"
                            />
                        </div>
                        <div className="auction-field">
                            <label className="auction-label">Konec aukce</label>
                            <input
                                type="datetime-local"
                                name="ends_at"
                                value={formData.ends_at}
                                onChange={handleChange}
                                className="auction-input"
                            />
                        </div>
                    </div>

                    <div className="auction-field">
                        <label className="auction-label">Hlavní obrázek (Cover Image)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="auction-input"
                        />
                    </div>

                    <div className="auction-field">
                        <label className="auction-label">Další obrázky (Galerie)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleFilesChange}
                            className="auction-input"
                        />
                    </div>

                    <div className="auction-checkbox-wrapper">
                        <input
                            type="checkbox"
                            name="big_preview"
                            id="big_preview"
                            checked={formData.big_preview}
                            onChange={handleChange}
                            className="auction-checkbox"
                        />
                        <label htmlFor="big_preview" className="auction-checkbox-label">
                            Zobrazit jako velký náhled (big preview)
                        </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <SubmitButton
                            title={loading ? 'Ukládá se...' : 'Vytvořit aukci'}
                            size="large"
                            disabled={loading}
                            cursor={loading ? 'not-allowed' : 'pointer'}
                        />
                    </div>
                </form>
            </div>
        </>
    );
}