"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Calendar, FileText, Clock } from "lucide-react";

export default function StudentSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/student", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { href: "/student/schedule", label: "My Timetable", icon: <Clock size={18} /> },
        { href: "/student/grades", label: "My Grades", icon: <FileText size={18} /> },
        { href: "/student/attendance", label: "My Attendance", icon: <Calendar size={18} /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full z-10">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className="size-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    S
                </div>
                <span className="font-bold text-lg text-zinc-900 tracking-tight">Student Portal</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${isActive
                                    ? "bg-green-50 text-green-700 border-l-4 border-green-500"
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
                        <p className="font-medium text-zinc-900">Student Account</p>
                        <p className="text-zinc-500">Class 10-A</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}