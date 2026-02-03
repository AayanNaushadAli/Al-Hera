import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Clock, AlertCircle } from "lucide-react";

// UPDATE 1: Change the type to Promise
export default async function ChildDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const user = await currentUser();
    if (!user) redirect("/");

    // UPDATE 2: Await the params before using them
    const { id } = await params;
    const studentId = parseInt(id);

    // UPDATE 3: Safety check - if ID isn't a number, go back
    if (isNaN(studentId)) {
        redirect("/parent");
    }

    // 1. SECURITY CHECK: Verify this student belongs to this Parent
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            class: true,
            parent: { include: { user: true } },
            attendance: {
                orderBy: { date: 'desc' },
                take: 5 // Last 5 records
            },
            marks: {
                include: { subject: true, exam: true },
                orderBy: { examId: 'desc' }
            }
        }
    });

    // If student doesn't exist, OR the parent linked to this student isn't the current user
    if (!student || student.parent?.user.clerkId !== user.id) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center mt-20">
                <AlertCircle size={48} className="text-red-500" />
                <h2 className="text-xl font-bold text-zinc-900">Access Denied</h2>
                <p className="text-zinc-500">You do not have permission to view this student profile.</p>
                <Link href="/parent" className="text-indigo-600 hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    // Calculate Attendance Percentage (Simple Version)
    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter(a => a.status === "PRESENT").length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <Link href="/parent" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">{student.fullName}</h1>
                    <p className="text-zinc-500">Class {student.class?.name} • Admission No: {student.admissionNo}</p>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Attendance Card */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Attendance</p>
                        <h3 className="text-2xl font-bold text-zinc-900">{attendancePercentage}%</h3>
                        <p className="text-xs text-green-600 mt-1">Recent Record</p>
                    </div>
                    <div className="size-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                </div>

                {/* Grade Card */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Recent Exam</p>
                        <h3 className="text-2xl font-bold text-zinc-900">
                            {student.marks[0]?.exam?.name || "No Data"}
                        </h3>
                    </div>
                    <div className="size-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                    </div>
                </div>

                {/* Schedule Link Card */}
                <Link href={`/parent/schedule/${student.classId}`} className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm text-white hover:opacity-90 transition flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="text-white/80 text-sm font-medium">Class Schedule</p>
                        <h3 className="text-xl font-bold">View Timetable</h3>
                    </div>
                    <Calendar size={24} className="text-white/80" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* RECENT ATTENDANCE LIST */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100">
                        <h3 className="font-bold text-zinc-900">Recent Attendance</h3>
                    </div>
                    <div className="p-6">
                        {student.attendance.length === 0 ? (
                            <p className="text-zinc-500 italic">No attendance records found.</p>
                        ) : (
                            <div className="space-y-3">
                                {student.attendance.map(record => (
                                    <div key={record.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                                        <span className="text-zinc-600 text-sm">
                                            {new Date(record.date).toLocaleDateString()}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${record.status === "PRESENT" ? "bg-green-100 text-green-700" :
                                                record.status === "ABSENT" ? "bg-red-100 text-red-700" :
                                                    "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RECENT GRADES LIST */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100">
                        <h3 className="font-bold text-zinc-900">Recent Results</h3>
                    </div>
                    <div className="p-6">
                        {student.marks.length === 0 ? (
                            <p className="text-zinc-500 italic">No marks recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {student.marks.slice(0, 5).map(mark => (
                                    <div key={mark.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-zinc-900 text-sm">{mark.subject.name}</p>
                                            <p className="text-xs text-zinc-500">{mark.exam.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-zinc-900 text-lg">{mark.marksObtained.toString()}</span>
                                            <span className="text-zinc-400 text-xs"> / {mark.totalMarks.toString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}