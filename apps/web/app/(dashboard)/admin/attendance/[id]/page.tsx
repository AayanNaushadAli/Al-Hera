import { prisma } from "@/lib/prisma";
import { markAttendance } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save, Calendar as CalendarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/SubmitButton";

export default async function MarkAttendancePage({ params, searchParams }: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ date?: string }>
}) {
    const { id } = await params;
    const { date } = await searchParams; // Allow changing date via URL in future

    const classId = parseInt(id);
    if (isNaN(classId)) return <div>Invalid Class ID</div>;

    // Default to today or the URL date
    const selectedDateStr = date || new Date().toISOString().split('T')[0];
    const selectedDate = new Date(selectedDateStr);

    // 1. Fetch Class and Students first
    const [classItem, students] = await Promise.all([
        prisma.class.findUnique({ where: { id: classId } }),
        prisma.student.findMany({
            where: { classId: classId },
            orderBy: { fullName: 'asc' }
        })
    ]);

    if (!classItem) notFound();

    // 2. Fetch Attendance (CORRECTED LOGIC HERE)
    // We can't filter by classId directly, so we filter by the list of student IDs we just fetched.
    const attendanceLogs = await prisma.attendance.findMany({
        where: {
            studentId: { in: students.map(s => s.id) }, // <--- THIS FIXED THE CRASH
            date: {
                gte: new Date(selectedDate.setHours(0, 0, 0, 0)), // Start of day
                lt: new Date(selectedDate.setHours(23, 59, 59, 999)) // End of day
            }
        }
    });

    // 3. Create a quick lookup map: { studentId: "PRESENT" | "ABSENT" }
    const attendanceMap: Record<number, string> = {};
    attendanceLogs.forEach(log => {
        attendanceMap[log.studentId] = log.status;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <Link href="/admin/attendance" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
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
                <input type="hidden" name="date" value={selectedDateStr} /> {/* Hidden Date Field needed for Action */}

                {/* DATE SELECTOR (Visual Only for now) */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4 max-w-xs">
                    <div className="bg-zinc-100 p-2 rounded-lg text-zinc-500">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase">Date</label>
                        <input
                            type="date"
                            name="date_display" // Changed name so it doesn't conflict with hidden field
                            defaultValue={selectedDateStr}
                            disabled // Disabled for now to prevent confusion until we add URL logic
                            className="font-medium text-zinc-900 bg-transparent focus:outline-none opacity-50 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* STUDENTS LIST */}
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Admission No</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-zinc-400">
                                        No students enrolled in this class.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => {
                                    // Determine status: Use DB value, or default to PRESENT if nothing found
                                    const currentStatus = attendanceMap[student.id] || "PRESENT";

                                    return (
                                        <tr key={student.id} className="hover:bg-zinc-50 transition">
                                            <td className="px-6 py-4 font-medium text-zinc-900">
                                                {student.fullName}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500">
                                                {student.admissionNo}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-6">
                                                    {/* Radio: PRESENT */}
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name={`status_${student.id}`}
                                                            value="PRESENT"
                                                            className="accent-green-600 size-4 cursor-pointer"
                                                            defaultChecked={currentStatus === "PRESENT"}
                                                        />
                                                        <span className="text-zinc-600 group-hover:text-green-700 font-medium">Present</span>
                                                    </label>

                                                    {/* Radio: ABSENT */}
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name={`status_${student.id}`}
                                                            value="ABSENT"
                                                            className="accent-red-600 size-4 cursor-pointer"
                                                            defaultChecked={currentStatus === "ABSENT"}
                                                        />
                                                        <span className="text-zinc-600 group-hover:text-red-700 font-medium">Absent</span>
                                                    </label>

                                                    {/* Radio: LATE */}
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name={`status_${student.id}`}
                                                            value="LATE"
                                                            className="accent-orange-500 size-4 cursor-pointer"
                                                            defaultChecked={currentStatus === "LATE"}
                                                        />
                                                        <span className="text-zinc-600 group-hover:text-orange-700 font-medium">Late</span>
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

                {/* SUBMIT BUTTON */}
                <div className="flex justify-end">
                    <SubmitButton label="Update Attendance" />
                </div>
            </form>
        </div>
    );
}