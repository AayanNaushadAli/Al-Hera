"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, FileText, Calendar, Users } from "lucide-react";

export default function ParentSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/parent", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        // We will build these next
        { href: "/parent/children", label: "My Children", icon: <Users size={18} /> },
        { href: "/parent/attendance", label: "Attendance Report", icon: <Calendar size={18} /> },
        { href: "/parent/grades", label: "Result Cards", icon: <FileText size={18} /> },
    ];

    return (
        <aside className="hidden md:flex w-64 bg-white border-r border-zinc-200 flex-col fixed h-full z-10">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className="size-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    P
                </div>
                <span className="font-bold text-lg text-zinc-900 tracking-tight">Parent Portal</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${isActive
                                    ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 border-l-4 border-transparent"
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-100">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                    <UserButton afterSignOutUrl="/" />
                    <div className="text-xs">
                        <p className="font-medium text-zinc-900">Parent Account</p>
                        <p className="text-zinc-500">Guardian</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}