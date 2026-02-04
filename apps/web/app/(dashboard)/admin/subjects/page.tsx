import { prisma } from "@/lib/prisma";
import { DeleteForm } from "@/components/DeleteForm";
import Link from "next/link";
import { Plus, Search, BookOpen } from "lucide-react";

export default async function SubjectsPage() {
  // Fetch subjects AND the class they belong to
  const subjects = await prisma.subject.findMany({
    orderBy: { classId: 'asc' }, // Group by class roughly
    include: { class: true }
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Subjects</h1>
          <p className="text-zinc-500">Manage curriculum and courses.</p>
        </div>
        <Link
          href="/admin/subjects/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition"
        >
          <Plus size={16} />
          Add Subject
        </Link>
      </div>

      {/* SEARCH (Visual) */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          placeholder="Search subjects..."
          className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
        />
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-zinc-500 gap-2">
            <BookOpen size={32} className="opacity-20" />
            <p>No subjects found. Add one to get started.</p>
          </div>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm flex items-center justify-between group hover:border-zinc-300 transition">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{subject.name}</h3>
                  <p className="text-xs text-zinc-500 font-medium bg-zinc-100 inline-block px-2 py-1 rounded mt-1">
                    {subject.class.name} {subject.class.section ? `(${subject.class.section})` : ""}
                  </p>
                </div>
              </div>

              {/* DELETE BUTTON */}
              <DeleteForm id={subject.id} action="subject" itemName={subject.name} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}