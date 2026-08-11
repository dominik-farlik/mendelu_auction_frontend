import type {UserResponse} from "../../api/userService.ts";
import {Link} from "react-router-dom";

export default function UserList({ users }: { users: UserResponse[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((user) => (
                <Link
                    to={`/uzivatel/${user.id}`}
                    key={user.id}
                    className="group block outline-none focus:ring-4 focus:ring-[#4ade80]/20 rounded-2xl"
                >
                <div className="bg-white border border-slate-200 rounded-xl px-5 py-2 flex items-center gap-4 transition-all hover:border-[#4ade80] hover:shadow-md">
                    <div
                        className="w-10 h-10 shrink-0 rounded-full bg-[#4ade80]/20 text-[#16a34a] flex items-center justify-center font-bold text-sm uppercase">
                        {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-slate-700 truncate">
                            {user.first_name} {user.last_name}
                        </strong>
                        <span className="text-slate-700 text-sm">
                            {user.email}
                        </span>
                        <span className="text-slate-500 text-xs italic">
                            {user.role.name}
                        </span>
                    </div>
                </div>
                </Link>
            ))}
        </div>
    )
}