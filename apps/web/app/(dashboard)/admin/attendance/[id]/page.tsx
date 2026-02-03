import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, X, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

// 1. Define the props correctly for Next.js 15 (Promises)
interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ date?: string }>;
}

export default async function AttendancePage({ params, searchParams }: PageProps) {
    const user = await currentUser();
    if (!user) redirect("/");

    // 2. Await the params and searchParams
    const { id } = await params;
    const { date } = await searchParams;
    const classId = parseInt(id);

    if (isNaN(classId)) redirect("/admin");

    // 3. Safe Date Logic: Use fallback if date is undefined
    const dateStr = date ?? new Date().toISOString().split('T')[0];
    const validDate = String(dateStr); // Ensure it's always a string
    const selectedDate = new Date(validDate);

    // 4. Fetch Data
    const [classItem, students] = await Promise.all([
        prisma.class.findUnique({
            where: { id: classId },
            include: {
                students: {
                    orderBy: { fullName: 'asc' },
                    include: {
                        attendance: {
                            where: {
                                date: {
                                    gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                                    lt: new Date(selectedDate.setHours(23, 59, 59, 999))
                                }
                            }
                        }
                    }
                }
            }
        }),
        prisma.student.findMany({
            where: { classId: classId },
            orderBy: { fullName: 'asc' }
        })
    ]);

    if (!classItem) return <div>Class not found</div>;

    // 5. Action to Save Attendance
    async function saveAttendance(formData: FormData) {
        "use server";

        // We need to re-parse the date inside the action because actions run separately
        const dateRaw = formData.get("date") as string;
        const targetDate = new Date(dateRaw || new Date());

        // Loop through all students to find their status in the form
        const updates = students.map(student => {
            const status = formData.get(`status-${student.id}`) as string;

            return prisma.attendance.upsert({
                where: {
                    studentId_date: {
                        studentId: student.id,
                        date: targetDate
                    }
                },
                update: { status: (status || "PRESENT") as "PRESENT" | "ABSENT" | "LATE" },
                create: {
                    studentId: student.id,
                    date: targetDate,
                    status: (status || "PRESENT") as "PRESENT" | "ABSENT" | "LATE"
                }
            });
        });

        await Promise.all(updates);
        revalidatePath(`/admin/attendance/${id}`);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-zinc-100 rounded-lg transition">
                        <ArrowLeft size={20} className="text-zinc-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">Mark Attendance</h1>
                        <p className="text-zinc-500">{classItem.name} • {validDate}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <form action={saveAttendance} className="p-0">
                    <input type="hidden" name="date" value={validDate} />

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Roll No</th>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4 text-center">Present</th>
                                    <th className="px-6 py-4 text-center">Absent</th>
                                    <th className="px-6 py-4 text-center">Late</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {students.map((student) => {
                                    // Find existing record for this student for today (if any)
                                    const existingRecord = classItem.students
                                        .find(s => s.id === student.id)
                                        ?.attendance[0];

                                    const currentStatus = existingRecord?.status || "PRESENT";

                                    return (
                                        <tr key={student.id} className="hover:bg-zinc-50/50">
                                            <td className="px-6 py-4 font-mono text-zinc-500">
                                                {student.rollNumber || "-"}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-zinc-900">
                                                {student.fullName}
                                            </td>

                                            {/* Radio Buttons for Status */}
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <input
                                                        type="radio"
                                                        name={`status-${student.id}`}
                                                        value="PRESENT"
                                                        defaultChecked={currentStatus === "PRESENT"}
                                                        className="size-5 text-green-600 focus:ring-green-500 border-gray-300"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <input
                                                        type="radio"
                                                        name={`status-${student.id}`}
                                                        value="ABSENT"
                                                        defaultChecked={currentStatus === "ABSENT"}
                                                        className="size-5 text-red-600 focus:ring-red-500 border-gray-300"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <input
                                                        type="radio"
                                                        name={`status-${student.id}`}
                                                        value="LATE"
                                                        defaultChecked={currentStatus === "LATE"}
                                                        className="size-5 text-yellow-500 focus:ring-yellow-400 border-gray-300"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end">
                        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                            Save Attendance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}