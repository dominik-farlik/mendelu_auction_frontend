import React, { useState } from 'react';
import { AxiosError } from 'axios';
import './AuthForm.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from "../navbar/Navbar.tsx";
import { type UserCreate, userService } from "../../api/userService.ts";

interface AuthFormProps {
    defaultIsLogin?: boolean;
}

export default function AuthForm({ defaultIsLogin = true }: AuthFormProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [isLogin, setIsLogin] = useState<boolean>(defaultIsLogin);
    const [user, setUser] = useState<UserCreate>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(() => {
        return searchParams.get('expired') === 'true'
            ? 'Vaše přihlášení vypršelo. Prosím, přihlaste se znovu.'
            : null;
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!user.email || !user.password) {
            setError("Vyplňte prosím e-mail a heslo.");
            return;
        }

        if (!isLogin && (!user.first_name || !user.last_name)) {
            setError("Pro registraci vyplňte prosím jméno a příjmení.");
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                await userService.login({
                    username: user.email,
                    password: user.password,
                });
                navigate('/');
            } else {
                const payload: UserCreate = {
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username || null,
                    password: user.password,
                };

                await userService.createUser(payload);

                setSuccessMessage("Účet byl úspěšně vytvořen. Nyní se můžete přihlásit.");
                setIsLogin(true);
                setUser((prev) => ({ ...prev, password: "" }));
            }
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const errorMsg = error.response?.data?.detail || (isLogin ? "Chyba při přihlašování." : "Chyba při registraci.");
            const strError = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg);
            setError(strError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero">
            <Navbar />
            <div className="auth-container">
                <div className="auth-card">
                    <div>
                        <h2 className="auth-title">
                            {isLogin ? 'Přihlaste se do svého účtu' : 'Vytvořte si nový účet'}
                        </h2>
                    </div>

                    {error && <div className="alert-error">{error}</div>}
                    {successMessage && <div className="alert-success">{successMessage}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-fields">
                            {!isLogin &&
                                <>
                                    <div className="auth-field-group">
                                        <label className="auth-label">Jméno*</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            required={!isLogin}
                                            value={user.first_name}
                                            onChange={handleChange}
                                            className="auth-input"
                                        />
                                    </div>
                                    <div className="auth-field-group">
                                        <label className="auth-label">Příjmení*</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            required={!isLogin}
                                            value={user.last_name}
                                            onChange={handleChange}
                                            className="auth-input"
                                        />
                                    </div>
                                </>
                            }
                            <div className="auth-field-group">
                                <label className="auth-label">E-mailová adresa*</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={user.email}
                                    onChange={handleChange}
                                    className="auth-input"
                                    placeholder="vas@email.cz"
                                />
                            </div>
                            <div className="auth-field-group">
                                <label className="auth-label">Heslo*</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={user.password}
                                        onChange={handleChange}
                                        className="auth-input"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle-button"
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="auth-button">
                                {loading ? 'Zpracovávám...' : (isLogin ? 'Přihlásit se' : 'Zaregistrovat se')}
                            </button>
                        </div>
                    </form>

                    <div className="auth-switch-container">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                                setSuccessMessage(null);
                            }}
                            className="auth-switch-button"
                        >
                            {isLogin
                                ? 'Nemáte ještě účet? Zaregistrujte se'
                                : 'Již máte účet? Přihlaste se'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}