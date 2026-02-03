import { createClass } from "@/lib/actions";
import { prisma } from "@/lib/prisma"; // <--- Added this to fetch teachers
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function AddClassPage() {
  // Fetch teachers for the dropdown
  const teachers = await prisma.teacher.findMany({
    orderBy: { fullName: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/classes"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create New Class</h1>
          <p className="text-zinc-500">Add a new grade level or section.</p>
        </div>
      </div>

      <form action={async (formData) => {
        "use server";
        await createClass(formData);
      }} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Class Name</label>
            <input
              name="name"
              required
              placeholder="e.g. Grade 10"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Capacity</label>
            <input
              name="capacity"
              type="number"
              defaultValue={30}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Class Supervisor (Teacher)</label>
          <select
            name="supervisorId"
            className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
          >
            <option value="">-- Select a Teacher --</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.fullName} ({t.specialization})</option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Create Class
          </button>
        </div>
      </form>
    </div>
  );
}