import { prisma } from "@/lib/prisma";
import { deleteExam } from "@/lib/actions";
import Link from "next/link";
import { Plus, Trash2, FileText, ChevronRight } from "lucide-react";

export default async function ExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: { id: 'desc' },
    include: { _count: { select: { marks: true } } } // Count how many marks entries exist
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Examinations</h1>
          <p className="text-zinc-500">Manage exam sessions and grading.</p>
        </div>
        <Link
          href="/admin/exams/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition"
        >
          <Plus size={16} />
          Create Exam
        </Link>
      </div>

      {/* EXAM LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500">
            No exams found. Schedule one to start grading.
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group h-full">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">{exam.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium bg-zinc-100 inline-block px-2 py-1 rounded mt-1">
                      {exam.term}
                    </p>
                  </div>
                </div>

                {/* DELETE BUTTON */}
                <form action={async (formData) => {
                  "use server";
                  await deleteExam(formData);
                }}>
                  <input type="hidden" name="id" value={exam.id} />
                  <button className="text-zinc-300 hover:text-red-500 transition">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {exam._count.marks} Records Found
                </span>

                {/* Link to the Grading Page (We will build this next) */}
                <Link
                  href={`/admin/exams/${exam.id}`}
                  className="text-sm font-bold text-black flex items-center gap-1 hover:underline"
                >
                  Manage Marks <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}