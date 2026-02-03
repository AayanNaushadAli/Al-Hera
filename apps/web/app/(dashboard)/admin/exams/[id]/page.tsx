import { prisma } from "@/lib/prisma";
import { updateMarks } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import { ArrowLeft, Search, Filter } from "lucide-react";

export default async function ExamGradingPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ classId?: string, subjectId?: string }>
}) {
  const { id } = await params;
  const { classId, subjectId } = await searchParams;
  const examId = parseInt(id);

  // 1. Fetch Exam & Options (Classes/Subjects)
  const [exam, classes, subjects] = await Promise.all([
    prisma.exam.findUnique({ where: { id: examId } }),
    prisma.class.findMany({ orderBy: { name: 'asc' } }),
    prisma.subject.findMany({
      orderBy: { name: 'asc' },
      include: { class: true }
    })
  ]);

  if (!exam) return <div>Exam not found</div>;

  // 2. If Class & Subject selected, Fetch Students & Marks
  let students: { id: number; fullName: string; admissionNo: string }[] = [];
  let existingMarks: Record<number, { obtained: number, total: number }> = {};

  if (classId && subjectId) {
    students = await prisma.student.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { fullName: 'asc' }
    });

    const marks = await prisma.mark.findMany({
      where: {
        examId: examId,
        subjectId: parseInt(subjectId),
        studentId: { in: students.map(s => s.id) }
      }
    });

    // Map marks for easy lookup
    marks.forEach(m => {
      existingMarks[m.studentId] = {
        obtained: Number(m.marksObtained),
        total: Number(m.totalMarks)
      };
    });
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/exams" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Grading: {exam.name}</h1>
          <p className="text-zinc-500">{exam.term}</p>
        </div>
      </div>

      {/* FILTER BAR - Pick Class & Subject */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <form className="flex flex-col md:flex-row gap-4 items-end">

          <div className="w-full">
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">1. Select Class</label>
            <select
              name="classId"
              defaultValue={classId}
              className="w-full p-2 border border-zinc-200 rounded-lg bg-white"
            >
              <option value="">-- Choose Class --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.section}</option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">2. Select Subject</label>
            <select
              name="subjectId"
              defaultValue={subjectId}
              className="w-full p-2 border border-zinc-200 rounded-lg bg-white"
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (for {s.class.name})
                </option>
              ))}
            </select>
          </div>

          <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition flex items-center gap-2">
            <Search size={18} />
            Load
          </button>
        </form>
      </div>

      {/* GRADING TABLE (Only shows if filters are selected) */}
      {classId && subjectId ? (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <h3 className="font-bold text-zinc-700">Student List</h3>
            <span className="text-xs bg-zinc-200 px-2 py-1 rounded text-zinc-600">
              {students.length} Students
            </span>
          </div>

          <form action={async (formData) => {
            "use server";
            await updateMarks(formData);
          }}>
            <input type="hidden" name="examId" value={examId} />
            <input type="hidden" name="classId" value={classId} />
            <input type="hidden" name="subjectId" value={subjectId} />

            <table className="w-full text-sm text-left">
              <thead className="bg-white text-zinc-500 font-medium border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3 w-32">Marks Obtained</th>
                  <th className="px-6 py-3 w-32">Total Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {students.map(student => {
                  const mark = existingMarks[student.id];
                  return (
                    <tr key={student.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-3 font-medium text-zinc-900">
                        {student.fullName}
                        <div className="text-xs text-zinc-400 font-normal">{student.admissionNo}</div>
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          step="0.01"
                          name={`obtained_${student.id}`}
                          defaultValue={mark?.obtained}
                          placeholder="0"
                          className="w-full p-2 border rounded text-center font-mono font-bold"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          name={`total_${student.id}`}
                          defaultValue={mark?.total || 100}
                          className="w-full p-2 border rounded text-center text-zinc-500 bg-zinc-50"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="p-4 border-t border-zinc-100 flex justify-end bg-zinc-50">
              <SubmitButton label="Save All Marks" />
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
          <Filter size={32} className="mx-auto mb-2 opacity-50" />
          <p>Select a Class and Subject above to start grading.</p>
        </div>
      )}
    </div>
  );
}