import type {UserResponse} from "../../api/userService.ts";
import {Link} from "react-router-dom";

type UserListProps = {
    users: UserResponse[];
    /** Když je zadané, u uživatelů, pro které canRemove vrátí true, se zobrazí tlačítko pro odebrání. */
    onRemove?: (user: UserResponse) => void;
    canRemove?: (user: UserResponse) => boolean;
    removeLabel?: string;
};

export default function UserList({ users, onRemove, canRemove, removeLabel = "Odebrat" }: UserListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((user) => {
                const removable = !!onRemove && (canRemove ? canRemove(user) : true);
                return (
                <div key={user.id} className="relative">
                <Link
                    to={`/uzivatel/${user.id}`}
                    className="group block outline-none focus:ring-4 focus:ring-[#4ade80]/20 rounded-2xl"
                >
                <div className={`bg-white border border-slate-200 rounded-xl px-5 py-2 flex items-center gap-4 transition-all hover:border-[#4ade80] hover:shadow-md ${removable ? "pr-14" : ""}`}>
                    <div
                        className="w-10 h-10 shrink-0 rounded-full bg-[#4ade80]/20 text-[#16a34a] flex items-center justify-center font-bold text-sm uppercase">
                        {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="flex flex-col truncate">
                        <strong className="text-slate-700">
                            {user.first_name} {user.last_name}
                        </strong>
                        <span
                            className="text-slate-700 text-sm"
                            title={user.email}
                        >
                            {user.email}
                        </span>
                        <span className="text-slate-500 text-xs italic">
                            {user.role.name}
                        </span>
                    </div>
                </div>
                </Link>
                {removable && (
                    <button
                        type="button"
                        onClick={() => onRemove(user)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label={`${removeLabel}: ${user.first_name} ${user.last_name}`}
                        title={removeLabel}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                    </button>
                )}
                </div>
                );
            })}
        </div>
    )
}