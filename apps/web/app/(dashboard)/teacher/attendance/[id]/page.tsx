import { prisma } from "@/lib/prisma";
import { markAttendance } from "@/lib/actions"; // We reuse the same action!
import { SubmitButton } from "@/components/SubmitButton"; 
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function TeacherMarkAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const classId = parseInt(id);

  if (isNaN(classId)) return <div>Invalid Class ID</div>;

  const today = new Date().toISOString().split('T')[0];
  const selectedDate = new Date(today);

  // 1. Fetch Class and Students
  // (In a real app, we would double-check here if the teacher is actually allowed to view this class ID)
  const [classItem, students] = await Promise.all([
    prisma.class.findUnique({ where: { id: classId } }),
    prisma.student.findMany({
      where: { classId: classId },
      orderBy: { fullName: 'asc' }
    })
  ]);

  if (!classItem) notFound();

  // 2. Fetch Existing Attendance
  const attendanceLogs = await prisma.attendance.findMany({
    where: {
      studentId: { in: students.map(s => s.id) },
      date: {
        gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      }
    }
  });

  const attendanceMap: Record<number, string> = {};
  attendanceLogs.forEach(log => {
    attendanceMap[log.studentId] = log.status;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/teacher/attendance" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Mark Attendance</h1>
          <p className="text-zinc-500">
             Class: <span className="font-semibold text-black">{classItem.name} {classItem.section}</span>
          </p>
        </div>
      </div>

      <form action={markAttendance} className="space-y-6">
        <input type="hidden" name="classId" value={classId} />
        <input type="hidden" name="date" value={today} />

        {/* DATE DISPLAY */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4 max-w-xs">
            <div className="bg-zinc-100 p-2 rounded-lg text-zinc-500">
                <CalendarIcon size={20} />
            </div>
            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase">Date</label>
                <div className="font-medium text-zinc-900">{today}</div>
            </div>
        </div>

        {/* STUDENTS LIST */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {students.length === 0 ? (
                <tr>
                    <td colSpan={2} className="p-8 text-center text-zinc-400">
                        No students enrolled.
                    </td>
                </tr>
              ) : (
                students.map((student) => {
                    const currentStatus = attendanceMap[student.id] || "PRESENT";
                    return (
                        <tr key={student.id} className="hover:bg-zinc-50 transition">
                        <td className="px-6 py-4 font-medium text-zinc-900">
                            {student.fullName}
                            <span className="block text-xs text-zinc-400 font-normal">{student.admissionNo}</span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-6">
                                {/* Radio Buttons */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name={`status_${student.id}`} value="PRESENT" defaultChecked={currentStatus === "PRESENT"} className="accent-green-600 size-4" />
                                    <span className="text-zinc-600">Present</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name={`status_${student.id}`} value="ABSENT" defaultChecked={currentStatus === "ABSENT"} className="accent-red-600 size-4" />
                                    <span className="text-zinc-600">Absent</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name={`status_${student.id}`} value="LATE" defaultChecked={currentStatus === "LATE"} className="accent-orange-500 size-4" />
                                    <span className="text-zinc-600">Late</span>
                                </label>
                            </div>
                        </td>
                        </tr>
                    );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
            <SubmitButton label="Save Attendance" />
        </div>
      </form>
    </div>
  );
}