"use client"; // This makes it a "Smart" component that knows the URL

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, Clock, FileText, Menu, X } from "lucide-react";
import { CheckSquare } from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Define all your links here
    const links = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { href: "/admin/teachers", label: "Teachers", icon: <Users size={18} /> },
        { href: "/admin/students", label: "Students", icon: <GraduationCap size={18} /> },
        { href: "/admin/subjects", label: "Subjects", icon: <BookOpen size={18} /> },
        { href: "/admin/classes", label: "Classes", icon: <Calendar size={18} /> },
        { href: "/admin/schedule", label: "Schedule", icon: <Clock size={18} /> },
        { href: "/admin/attendance", label: "Attendance", icon: <CheckSquare size={18} /> },
        { href: "/admin/exams", label: "Exams", icon: <FileText size={18} /> },
        { href: "/admin/parents", label: "Parents", icon: <Users size={18} /> },
    ];

    return (
        <>
            {/* MOBILE HAMBURGER BUTTON */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-sm border border-zinc-200 text-zinc-600"
            >
                <Menu size={24} />
            </button>

            {/* OVERLAY for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-white border-r border-zinc-200 z-50 transition-transform duration-300 ease-in-out
                flex flex-col
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
            `}>
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            S
                        </div>
                        <span className="font-bold text-lg text-zinc-900 tracking-tight">SchoolSys</span>
                    </div>
                    {/* CLOSE BUTTON (Mobile Only) */}
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-zinc-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)} // Close menu on click
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${isActive
                                    ? "bg-zinc-100 text-zinc-900 border-l-4 border-black" // Active Style
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
                            <p className="font-medium text-zinc-900">Admin Account</p>
                            <p className="text-zinc-500">Manage System</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}