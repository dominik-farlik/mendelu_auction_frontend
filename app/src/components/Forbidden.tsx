import { Link, useNavigate } from "react-router-dom";
import Page from "./Page.tsx";
import Navbar from "./navbar/Navbar.tsx";

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <Page>
            <Navbar />
            <div className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 flex flex-col items-center text-center gap-6">
                    <span className="text-8xl md:text-9xl font-black text-[#4ade80] leading-none">403</span>

                    <div className="flex flex-col gap-3">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight m-0">
                            Přístup odepřen
                        </h1>
                        <p className="text-gray-600 leading-relaxed m-0">
                            Na tuto stránku nemáte dostatečná oprávnění. Pokud si myslíte, že jde o chybu,
                            kontaktujte správce.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            Zpět
                        </button>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-[#4ade80] text-slate-900 font-bold rounded-xl hover:bg-[#22c55e] transition-colors text-center no-underline"
                        >
                            Na úvodní stránku
                        </Link>
                    </div>
                </div>
            </div>
        </Page>
    );
}