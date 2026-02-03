import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default async function StudentAttendancePage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // 1. Get Student Profile
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { studentProfile: true }
  });

  if (!dbUser?.studentProfile) redirect("/");

  const studentId = dbUser.studentProfile.id;

  // 2. Fetch Attendance Records (Newest first)
  const attendanceLogs = await prisma.attendance.findMany({
    where: { studentId: studentId },
    orderBy: { date: 'desc' }
  });

  // 3. Calculate Stats
  const total = attendanceLogs.length;
  const present = attendanceLogs.filter(a => a.status === "PRESENT").length;
  const late = attendanceLogs.filter(a => a.status === "LATE").length;
  const absent = attendanceLogs.filter(a => a.status === "ABSENT").length;

  const percentage = total === 0 ? 0 : Math.round(((present + late) / total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Attendance History</h1>
          <p className="text-zinc-500">A detailed log of your daily attendance.</p>
        </div>
        
        {/* SUMMARY CARD */}
        <div className="bg-white px-6 py-3 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-6">
            <div className="text-center">
                <div className="text-2xl font-bold text-zinc-900">{total}</div>
                <div className="text-xs text-zinc-400 uppercase font-bold">Total Days</div>
            </div>
            <div className="w-px h-8 bg-zinc-100" />
            <div className="text-center">
                <div className={`text-2xl font-bold ${percentage >= 75 ? "text-green-600" : "text-red-500"}`}>
                    {percentage}%
                </div>
                <div className="text-xs text-zinc-400 uppercase font-bold">Rate</div>
            </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-100">
                <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Remarks</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
                {attendanceLogs.length === 0 ? (
                    <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-400">
                            No attendance records found.
                        </td>
                    </tr>
                ) : (
                    attendanceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-50 transition">
                            <td className="px-6 py-4 font-medium text-zinc-900 flex items-center gap-2">
                                <Calendar size={16} className="text-zinc-400" />
                                {log.date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                                {log.status === "PRESENT" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        <CheckCircle size={12} /> Present
                                    </span>
                                )}
                                {log.status === "ABSENT" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                        <XCircle size={12} /> Absent
                                    </span>
                                )}
                                {log.status === "LATE" && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                                        <Clock size={12} /> Late
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-zinc-500 italic">
                                {log.remarks || "-"}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}