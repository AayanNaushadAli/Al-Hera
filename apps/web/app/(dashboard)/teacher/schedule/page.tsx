import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, Clock, MapPin } from "lucide-react";

export default async function TeacherSchedulePage() {
    const user = await currentUser();
    if (!user) redirect("/");

    // 1. Get the Teacher Profile
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
        include: { teacherProfile: true }
    });

    if (!dbUser?.teacherProfile) redirect("/");

    // 2. Fetch routines for THIS teacher only
    const routines = await prisma.classRoutine.findMany({
        where: {
            teacherId: dbUser.teacherProfile.id
        },
        include: {
            class: true,
            subject: true
        },
        orderBy: {
            startTime: 'asc' // Sort by time within the day
        }
    });

    // 3. Helper to organize routines by Day
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">My Schedule</h1>
                <p className="text-zinc-500">Your weekly teaching timetable.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {days.map((day) => {
                    // Filter routines for this specific day
                    const dayRoutines = routines.filter(r => r.dayOfWeek === day);

                    // If no classes on this day, skip it (or show empty state)
                    if (dayRoutines.length === 0) return null;

                    return (
                        <div key={day} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-zinc-50 p-4 border-b border-zinc-100 flex items-center gap-2">
                                <Calendar size={18} className="text-zinc-500" />
                                <h3 className="font-bold text-zinc-900">{day}</h3>
                            </div>

                            <div className="divide-y divide-zinc-100">
                                {dayRoutines.map((routine) => (
                                    <div key={routine.id} className="p-4 hover:bg-zinc-50 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-lg text-zinc-900">
                                                {routine.subject.name}
                                            </span>
                                            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                {routine.class.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {/* Format Time: 09:00 - 10:00 */}
                                                {routine.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {routine.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Empty State if no routines found at all */}
                {routines.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
                        No schedule found. Ask an admin to assign you to a class.
                    </div>
                )}
            </div>
        </div>
    );
}