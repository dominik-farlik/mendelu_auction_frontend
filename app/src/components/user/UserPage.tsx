import Navbar from "../navbar/Navbar.tsx";
import UserPageMenu from "./UserPageMenu.tsx";
import Page from "../Page.tsx";
import React from "react";

type UserPageProps = {
    children: React.ReactNode;
    currentWindow?: "osobni-udaje" | "skupiny" | "vytvorit-skupinu" | "moje-prihozy";
}

export default function UserPage({children, currentWindow = "osobni-udaje"}: UserPageProps) {
    return (
        <Page>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 lg:gap-12 w-full">
                <UserPageMenu currentWindow={currentWindow} />

                <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm border border-slate-200">
                    <div className="flex flex-col h-full">
                        {children}
                    </div>
                </div>
            </div>
        </Page>
    );
}