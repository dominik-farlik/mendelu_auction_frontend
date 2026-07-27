import React, { useState } from 'react';
import { AxiosError } from 'axios';
import api from '../../api/axios.ts';
import './AuthForm.css';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
    defaultIsLogin?: boolean;
}

export default function AuthForm({ defaultIsLogin = true }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState<boolean>(defaultIsLogin);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            let response;

            if (isLogin) {
                const formData = new URLSearchParams();
                formData.append('username', username);
                formData.append('password', password);

                response = await api.post(endpoint, formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
            } else {
                response = await api.post(endpoint, {
                    username,
                    password,
                });
            }

            setSuccessMessage(
                isLogin
                    ? 'Přihlášení proběhlo úspěšně!'
                    : 'Registrace proběhla úspěšně! Nyní se můžete přihlásit.'
            );

            if (isLogin) {
                console.log('Přihlášení OK:', response.data);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setIsLogin(true);
            }
        } catch (err) {
            const axiosError = err as AxiosError<{ detail?: string }>;

            const errorMessage =
                axiosError.response?.data?.detail ||
                'Něco se pokazilo. Zkuste to prosím znovu.';

            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div>
                    <h2 className="auth-title">
                        {isLogin ? 'Přihlaste se do svého účtu' : 'Vytvořte si nový účet'}
                    </h2>
                </div>

                {error && <div className="auth-alert-error">{error}</div>}
                {successMessage && <div className="auth-alert-success">{successMessage}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-fields">
                        <div className="auth-field-group">
                            <label className="auth-label">Uživatelské jméno</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="auth-input"
                                placeholder=""
                            />
                        </div>
                        <div className="auth-field-group">
                            <label className="auth-label">Heslo</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
    );
}