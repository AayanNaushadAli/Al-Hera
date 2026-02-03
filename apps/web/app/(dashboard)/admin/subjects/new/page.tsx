import { prisma } from "@/lib/prisma";
import { createSubject } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function AddSubjectPage() {
  // Fetch classes for the dropdown
  const classes = await prisma.class.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/subjects" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Add Subject</h1>
          <p className="text-zinc-500">Create a new course for a specific class.</p>
        </div>
      </div>

      <form action={createSubject} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Subject Name</label>
            <input 
              name="name" 
              required 
              type="text" 
              placeholder="e.g. Advanced Mathematics" 
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Assign to Class</label>
            <select 
              name="classId"
              required
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.section ? `(${cls.section})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Create Subject
          </button>
        </div>

      </form>
    </div>
  );
}