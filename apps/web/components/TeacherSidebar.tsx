"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Calendar, BookOpen, CheckSquare, FileSignature } from "lucide-react";

export default function TeacherSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/teacher", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/teacher/schedule", label: "My Schedule", icon: <Calendar size={18} /> },
    { href: "/teacher/classes", label: "My Classes", icon: <BookOpen size={18} /> },
    { href: "/teacher/attendance", label: "Mark Attendance", icon: <CheckSquare size={18} /> },
    { href: "/teacher/marks", label: "Enter Marks", icon: <FileSignature size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full z-10">
      <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
         <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
           T
         </div>
         <span className="font-bold text-lg text-zinc-900 tracking-tight">Teacher Portal</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/teacher");
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                isActive 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
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
             <p className="font-medium text-zinc-900">Teacher Account</p>
             <p className="text-zinc-500">Academic Staff</p>
           </div>
         </div>
      </div>
    </aside>
  );
}