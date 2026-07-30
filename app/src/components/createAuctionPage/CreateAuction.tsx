import { useState } from 'react';
import './CreateAuction.css';
import Navbar from "../navbar/Navbar.tsx";

export default function CreateAuction() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sale_type: 'auction',
        big_preview: false,
        starting_price: '',
        buy_now_price: '',
        starts_at: '',
        ends_at: '',
        cover_image: '',
        owner_id: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const payload = {
            ...formData,
            starting_price: parseFloat(formData.starting_price),
            buy_now_price: formData.buy_now_price ? parseFloat(formData.buy_now_price) : null,
            owner_id: parseInt(formData.owner_id, 10),
            starts_at: formData.starts_at ? new Date(formData.starts_at).toISOString() : null,
            ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
        };

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Při vytváření aukce došlo k chybě.');
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
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
                    {/* Název */}
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

                    {/* Popis */}
                    <div className="auction-field">
                        <label className="auction-label">Popis</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="auction-textarea"
                        />
                    </div>

                    {/* Typ prodeje (SaleType) */}
                    <div className="auction-field">
                        <label className="auction-label">Typ prodeje</label>
                        <select
                            name="sale_type"
                            value={formData.sale_type}
                            onChange={handleChange}
                            className="auction-select"
                        >
                            <option value="auction">Aukce</option>
                            <option value="buy_now">Kup teď</option>
                            <option value="both">Obojí</option>
                        </select>
                    </div>

                    {/* Ceny */}
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

                    {/* Termíny */}
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

                    {/* Obalový obrázek */}
                    <div className="auction-field">
                        <label className="auction-label">Obrázek (URL / Cesta)</label>
                        <input
                            type="text"
                            name="cover_image"
                            maxLength={255}
                            value={formData.cover_image}
                            onChange={handleChange}
                            className="auction-input"
                        />
                    </div>

                    {/* ID Vlastníka */}
                    <div className="auction-field">
                        <label className="auction-label">ID Vlastníka (owner_id)</label>
                        <input
                            type="number"
                            name="owner_id"
                            required
                            value={formData.owner_id}
                            onChange={handleChange}
                            className="auction-input"
                        />
                    </div>

                    {/* Big Preview */}
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

                    {/* Tlačítko odeslat */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="auction-submit-btn"
                    >
                        {loading ? 'Ukládá se...' : 'Vytvořit aukci'}
                    </button>
                </form>
            </div>
        </>
    );
}