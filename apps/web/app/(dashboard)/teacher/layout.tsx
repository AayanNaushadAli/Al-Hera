// Role check can be added here when utils/roles is implemented
import TeacherSidebar from "@/components/TeacherSidebar"; // We'll make this too
import { redirect } from "next/navigation";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Security Check: Are they really a Teacher?
  // (We will create a helper for this so we don't repeat code)
  // For now, let's assume if they hit this route, we check their role manually or via middleware.
  // We'll stick to a simple check inside the page for now to keep it easy.

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* DIFFERENT SIDEBAR FOR TEACHERS */}
      <TeacherSidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}