import ParentSidebar from "@/components/ParentSidebar";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50">
      <ParentSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto h-full mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-zinc-200 p-4 flex justify-around items-center z-50">
        <a href="/parent" className="flex flex-col items-center text-zinc-500 hover:text-indigo-600">
          {/* You can import icons here if you make this a client component, or just use text/emoji for simplicity in this layout file. 
               However, Layout is server component usually. Let's keep it simple. */}
          <span className="text-xs font-bold">Dashboard</span>
        </a>
        <a href="/parent/children" className="flex flex-col items-center text-zinc-500 hover:text-indigo-600">
          <span className="text-xs font-bold">Children</span>
        </a>
        <a href="/parent/schedule/placeholder" className="flex flex-col items-center text-zinc-500 hover:text-indigo-600">
          <span className="text-xs font-bold">Schedule</span>
        </a>
      </div>
    </div>
  );
}