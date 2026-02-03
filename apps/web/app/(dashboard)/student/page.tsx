import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { studentProfile: { include: { class: true } } }
  });

  if (!dbUser || dbUser.role !== "STUDENT" || !dbUser.studentProfile) {
     return <div className="p-12 text-red-500">⛔ Access Denied: Not a Student account.</div>;
  }

  const student = dbUser.studentProfile;

  // --- 🧮 REAL ATTENDANCE CALCULATION ---
  const totalClasses = await prisma.attendance.count({
    where: { studentId: student.id }
  });

  const attendedClasses = await prisma.attendance.count({
    where: {
      studentId: student.id,
      status: { in: ["PRESENT", "LATE"] } // We count "LATE" as attended
    }
  });

  // Calculate percentage (avoid dividing by zero)
  const attendancePercentage = totalClasses === 0 
    ? 0 
    : Math.round((attendedClasses / totalClasses) * 100);
  
  // Color logic: Green if > 75%, Red if low
  const percentageColor = attendancePercentage >= 75 ? "text-green-600" : "text-red-500";


  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-zinc-900">
                Welcome back, {student.fullName.split(" ")[0]}! 👋
            </h1>
            <p className="text-zinc-500 mt-2">
                You are enrolled in <span className="font-bold text-black">{student.class?.name || "No Class"}</span>.
            </p>
        </div>
        
        {/* REAL DYNAMIC STATS */}
        <div className="hidden md:block text-right">
            <div className={`text-4xl font-bold ${percentageColor}`}>
                {attendancePercentage}%
            </div>
            <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                Attendance ({attendedClasses}/{totalClasses})
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="h-64 bg-blue-500 rounded-xl p-6 text-white flex flex-col justify-between">
            <h3 className="font-bold text-xl opacity-90">Upcoming Exams</h3>
            <p className="opacity-75">No exams scheduled for this week.</p>
         </div>
         <div className="h-64 bg-white border border-zinc-200 rounded-xl p-6">
            <h3 className="font-bold text-xl text-zinc-900 mb-4">Recent Activity</h3>
            <p className="text-zinc-400 text-sm">No recent activity.</p>
         </div>
      </div>
    </div>
  );
}