import { createExam } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AddExamPage() {
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/exams" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create Exam Session</h1>
          <p className="text-zinc-500">Define a new examination period.</p>
        </div>
      </div>

      <form action={async (formData) => {
        "use server";
        await createExam(formData);
      }} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Exam Name</label>
            <input
              name="name"
              required
              type="text"
              placeholder="e.g. Mid-Term 2024"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Term / Semester</label>
            <select
              name="term"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/5"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Create Exam
          </button>
        </div>

      </form>
    </div>
  );
}