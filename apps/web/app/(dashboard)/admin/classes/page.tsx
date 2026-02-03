import { prisma } from "@/lib/prisma";
import { deleteClass } from "@/lib/actions";
import Link from "next/link";
import { Plus, Trash2, Users } from "lucide-react";

export default async function ClassesPage() {
  // 1. Fetch classes AND count how many students are in each
  const classes = await prisma.class.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { students: true } // This magically counts students!
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Classes</h1>
          <p className="text-zinc-500">Manage academic grades and sections.</p>
        </div>
        <Link
          href="/admin/classes/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition"
        >
          <Plus size={16} />
          Create Class
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500">
            No classes found. Create one to get started.
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex items-center justify-between hover:border-zinc-300 transition">
              <Link href={`/admin/classes/${cls.id}`} className="flex-1">
                <h3 className="text-lg font-bold text-zinc-900">
                  {cls.name} <span className="text-zinc-400 font-normal text-sm">({cls.section || "No Section"})</span>
                </h3>
                <div className="flex items-center gap-2 text-zinc-500 mt-2 text-sm">
                  <Users size={16} />
                  <span>{cls._count.students} Students</span>
                </div>
              </Link>

              <form action={async (formData) => {
                "use server";
                await deleteClass(formData);
              }}>
                <input type="hidden" name="id" value={cls.id} />
                <button className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}