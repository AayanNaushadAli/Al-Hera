import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// Helper to format time (e.g. 09:00 AM)
const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export default async function ParentSchedulePage({ 
  params 
}: { 
  params: Promise<{ classId: string }> 
}) {
  const user = await currentUser();
  if (!user) redirect("/");

  const { classId } = await params;
  const id = parseInt(classId);
  if (isNaN(id)) redirect("/parent");

  // 1. SECURITY CHECK: Does this Parent have ANY child in this class?
  const parentWithChildInClass = await prisma.parent.findFirst({
    where: {
      user: { clerkId: user.id },
      children: {
        some: { classId: id }
      }
    }
  });

  if (!parentWithChildInClass) {
     return <div className="p-12 text-center text-red-500">⛔ You do not have permission to view this class schedule.</div>;
  }

  // 2. Fetch the Class & Routine
  const classData = await prisma.class.findUnique({
    where: { id: id },
    include: {
      routines: {
        include: {
          subject: true,
          teacher: true
        },
        orderBy: { startTime: 'asc' }
      }
    }
  });

  if (!classData) return <div className="p-12">Class not found.</div>;

  // Group routines by day
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const routineByDay: Record<string, typeof classData.routines> = {};
  
  days.forEach(day => {
    routineByDay[day] = classData.routines.filter(r => r.dayOfWeek === day);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/parent" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
           <ArrowLeft size={20} />
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-zinc-900">Class Timetable</h1>
           <p className="text-zinc-500">{classData.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => (
            <div key={day} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-600" />
                    <h3 className="font-bold text-zinc-900">{day}</h3>
                </div>
                
                <div className="divide-y divide-zinc-100">
                    {routineByDay[day]?.length === 0 ? (
                        <div className="p-4 text-center text-zinc-400 text-sm italic">
                            No classes scheduled.
                        </div>
                    ) : (
                        routineByDay[day]?.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-zinc-50 transition">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-zinc-900">{item.subject.name}</h4>
                                    <span className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded text-zinc-600">
                                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <div className="size-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                        {item.teacher?.fullName[0] || "T"}
                                    </div>
                                    <span>{item.teacher?.fullName || "No Teacher"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}