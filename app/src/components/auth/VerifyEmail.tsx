import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import AuthPage from "./AuthPage.tsx";
import { authService } from "../../api/authService.ts";

type VerifyState = "verifying" | "success" | "error";

const getErrorMessage = (err: unknown, fallback: string) => {
    const detail = (err as AxiosError<{ detail?: unknown }>).response?.data?.detail;
    return typeof detail === "string" ? detail : fallback;
};

/**
 * Stránka z ověřovacího odkazu v e-mailu. Token se na backend posílá přes POST,
 * aby účet neověřila už automatická kontrola odkazů v poštovním klientovi.
 */
export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [state, setState] = useState<VerifyState>(token ? "verifying" : "error");
    const [message, setMessage] = useState<string>(
        token ? "Ověřuji váš e-mail..." : "Odkaz neobsahuje ověřovací token."
    );

    const [email, setEmail] = useState<string>("");
    const [resending, setResending] = useState<boolean>(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [resendError, setResendError] = useState<string | null>(null);

    // V React StrictMode se efekt v dev režimu spouští dvakrát, token posíláme jen jednou.
    const requestedToken = useRef<string | null>(null);

    useEffect(() => {
        if (!token || requestedToken.current === token) return;
        requestedToken.current = token;

        authService.verifyEmail(token)
            .then((data) => {
                setState("success");
                setMessage(data.message);
            })
            .catch((err) => {
                setState("error");
                setMessage(getErrorMessage(err, "E-mail se nepodařilo ověřit."));
            });
    }, [token]);

    const handleResend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResendError(null);
        setResendMessage(null);
        setResending(true);

        try {
            const data = await authService.resendVerification(email);
            setResendMessage(data.message);
        } catch (err) {
            setResendError(getErrorMessage(err, "Ověřovací e-mail se nepodařilo odeslat."));
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthPage title="Ověření e-mailu">
            {state === "verifying" && (
                <div className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-3 rounded-xl text-sm font-medium">
                    {message}
                </div>
            )}

            {state === "success" && (
                <div className="flex flex-col gap-5">
                    <div className="bg-[#4ade80]/20 border border-[#4ade80]/30 text-[#16a34a] px-4 py-3 rounded-xl text-sm font-medium">
                        {message}
                    </div>
                    <Link
                        to="/login"
                        className="w-full text-center bg-[#4ade80] hover:bg-[#22c55e] text-slate-900 font-black text-lg py-3.5 px-4 rounded-xl transition-colors uppercase tracking-wide shadow-sm"
                    >
                        Přihlásit se
                    </Link>
                </div>
            )}

            {state === "error" && (
                <div className="flex flex-col gap-5">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {message}
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleResend}>
                        <p className="text-sm text-slate-500 m-0">
                            Zadejte e-mail, se kterým jste se registrovali, a pošleme vám nový ověřovací odkaz.
                        </p>

                        {resendMessage && (
                            <div className="bg-[#4ade80]/20 border border-[#4ade80]/30 text-[#16a34a] px-4 py-3 rounded-xl text-sm font-medium">
                                {resendMessage}
                            </div>
                        )}
                        {resendError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                {resendError}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="resend_email" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                                E-mailová adresa*
                            </label>
                            <input
                                id="resend_email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4ade80]/20 transition-all text-slate-900 font-medium"
                                placeholder="vas@email.cz"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={resending || !email}
                            className="w-full mt-2 bg-[#4ade80] hover:bg-[#22c55e] text-slate-900 font-black text-lg py-3.5 px-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide shadow-sm"
                        >
                            {resending ? "Odesílám..." : "Poslat nový odkaz"}
                        </button>
                    </form>

                    <Link
                        to="/login"
                        className="text-sm font-bold text-slate-500 hover:text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 transition-colors"
                    >
                        Vrátit se zpět na přihlášení
                    </Link>
                </div>
            )}
        </AuthPage>
    );
}
