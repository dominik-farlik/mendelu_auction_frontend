import type {UserResponse} from "../../api/userService.ts";

export default function UserList({ users }: { users: UserResponse[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((user) => (
                <div key={user.id}
                     className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4 transition-all hover:border-[#4ade80] hover:shadow-md">
                    <div
                        className="w-10 h-10 shrink-0 rounded-full bg-[#4ade80]/20 text-[#16a34a] flex items-center justify-center font-bold text-sm uppercase">
                        {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="flex flex-col">
                        <strong className="text-slate-700 truncate">
                            {user.first_name} {user.last_name}
                        </strong>
                        <span className="text-slate-500 text-sm">
                            {user.role.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}