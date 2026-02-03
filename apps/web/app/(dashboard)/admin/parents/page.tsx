import { prisma } from "@/lib/prisma";
import { deleteParent } from "@/lib/actions";
import Link from "next/link";
import { Plus, Search, Trash2, User, Phone } from "lucide-react";

export default async function ParentsPage() {
  const parents = await prisma.parent.findMany({
    orderBy: { id: 'desc' },
    include: {
      user: true,
      children: true // Fetch linked kids
    }
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Parents</h1>
          <p className="text-zinc-500">Manage guardian details.</p>
        </div>
        <Link
          href="/admin/parents/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition"
        >
          <Plus size={16} />
          Add Parent
        </Link>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          placeholder="Search parents..."
          className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
        />
      </div>

      {/* PARENT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500">
            No parents found.
          </div>
        ) : (
          parents.map((parent) => (
            <div key={parent.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg">{parent.fullName}</h3>
                    <p className="text-sm text-zinc-500">{parent.user?.email}</p>
                  </div>
                </div>

                <form action={async (formData) => {
                  "use server";
                  await deleteParent(formData);
                }}>
                  <input type="hidden" name="id" value={parent.id} />
                  <button className="text-zinc-300 hover:text-red-500 transition">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-50 space-y-2">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Children</div>
                <div className="flex flex-wrap gap-2">
                  {parent.children.length > 0 ? (
                    parent.children.map(child => (
                      <span key={child.id} className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded text-xs font-medium">
                        {child.fullName}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-400 italic">No children linked</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}