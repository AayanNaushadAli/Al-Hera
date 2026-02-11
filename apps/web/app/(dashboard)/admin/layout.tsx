import AdminSidebar from "@/components/AdminSidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get logged in user
  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Use the new Smart Sidebar */}
      <AdminSidebar />

      {/* --- MAIN CONTENT AREA --- */}
      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-14 md:pt-8 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}