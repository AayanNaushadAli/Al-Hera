import { prisma } from "@/lib/prisma";
import { updateMarks } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { notFound } from "next/navigation";

interface Params {
    params: Promise<{
        examId: string;
        classId: string;
        subjectId: string;
    }>
}

export default async function GradingPage({ params }: Params) {
  const { examId, classId, subjectId } = await params;

  // 1. Fetch Context (Exam, Class, Subject)
  const [exam, classItem, subject, students] = await Promise.all([
    prisma.exam.findUnique({ where: { id: parseInt(examId) } }),
    prisma.class.findUnique({ where: { id: parseInt(classId) } }),
    prisma.subject.findUnique({ where: { id: parseInt(subjectId) } }),
    prisma.student.findMany({ 
        where: { classId: parseInt(classId) },
        orderBy: { fullName: 'asc' }
    })
  ]);

  if (!exam || !classItem || !subject) notFound();

  // 2. Fetch Existing Marks (to pre-fill the inputs)
  const existingMarks = await prisma.mark.findMany({
    where: {
        examId: parseInt(examId),
        subjectId: parseInt(subjectId),
        studentId: { in: students.map(s => s.id) }
    }
  });

  // Create a quick lookup map: { studentId: marksObtained }
  const marksMap: Record<number, number> = {};
  existingMarks.forEach(m => {
    marksMap[m.studentId] = Number(m.marksObtained);
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/teacher/marks" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Grading: {subject.name}</h1>
          <p className="text-zinc-500">
            {exam.name} • {classItem.name}
          </p>
        </div>
      </div>

      <form action={updateMarks} className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <input type="hidden" name="examId" value={examId} />
        <input type="hidden" name="classId" value={classId} />
        <input type="hidden" name="subjectId" value={subjectId} />

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
                    <tr>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Admission No</th>
                        <th className="px-6 py-4 w-48">Marks (out of 100)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {students.map((student) => (
                        <tr key={student.id} className="hover:bg-zinc-50 transition">
                            <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-3">
                                <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <User size={14} />
                                </div>
                                {student.fullName}
                            </td>
                            <td className="px-6 py-4 text-zinc-500">
                                {student.admissionNo}
                            </td>
                            <td className="px-6 py-4">
                                <input 
                                    type="number" 
                                    name={`mark_${student.id}`} 
                                    defaultValue={marksMap[student.id] ?? ""} 
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    placeholder="--"
                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex justify-end">
            <div className="w-48">
                <SubmitButton label="Save Grades" />
            </div>
        </div>
      </form>
    </div>
  );
}