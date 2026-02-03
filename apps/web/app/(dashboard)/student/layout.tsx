import StudentSidebar from "@/components/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50">
      <StudentSidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}