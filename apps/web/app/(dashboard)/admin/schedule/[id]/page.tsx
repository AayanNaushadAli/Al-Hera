import { prisma } from "@/lib/prisma";
import { createRoutine, deleteRoutine } from "@/lib/actions"; // Import actions
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Clock, BookOpen, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ClassSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const classId = parseInt(id);

  if (isNaN(classId)) return <div>Invalid Class ID</div>;

  // 1. Fetch Class Details, existing Routines, Subjects, and Teachers
  const [classItem, routines, subjects, teachers] = await Promise.all([
    prisma.class.findUnique({ where: { id: classId } }),
    prisma.classRoutine.findMany({
      where: { classId: classId },
      include: { subject: true, teacher: true },
      orderBy: { startTime: 'asc' }
    }),
    prisma.subject.findMany({ where: { classId: classId } }), // Only subjects for this class
    prisma.teacher.findMany()
  ]);

  if (!classItem) notFound();

  // 2. Helper to group routines by Day
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  // Format time helper (e.g. 2024-01-01T09:00:00 -> "09:00")
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/schedule" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Schedule: {classItem.name}</h1>
          <p className="text-zinc-500">Manage weekly routine.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: The Timetable Display */}
        <div className="lg:col-span-2 space-y-6">
          {days.map((day) => {
            // Filter routines for this specific day
            const dailyRoutines = routines.filter(r => r.dayOfWeek === day);

            return (
              <div key={day} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-zinc-50 px-6 py-3 border-b border-zinc-200 font-bold text-zinc-700">
                  {day}
                </div>
                <div className="divide-y divide-zinc-100">
                  {dailyRoutines.length === 0 ? (
                    <div className="p-6 text-center text-sm text-zinc-400 italic">
                      No lessons scheduled.
                    </div>
                  ) : (
                    dailyRoutines.map((routine) => (
                      <div key={routine.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition group">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm font-bold font-mono">
                            {formatTime(routine.startTime)} - {formatTime(routine.endTime)}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 flex items-center gap-2">
                                <BookOpen size={16} className="text-zinc-400"/>
                                {routine.subject.name}
                            </div>
                            <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                                <User size={14} />
                                {routine.teacher ? routine.teacher.fullName : "No Teacher Assigned"}
                            </div>
                          </div>
                        </div>

                        {/* DELETE BUTTON */}
                        <form action={deleteRoutine}>
                            <input type="hidden" name="id" value={routine.id} />
                            <input type="hidden" name="classId" value={classId} />
                            <button className="text-zinc-300 hover:text-red-500 transition p-2">
                                <Trash2 size={18} />
                            </button>
                        </form>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Add Lesson Form */}
        <div className="lg:col-span-1">
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm sticky top-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Plus size={20} /> Add Lesson
                </h3>
                
                <form action={createRoutine} className="space-y-4">
                    <input type="hidden" name="classId" value={classId} />

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Day</label>
                        <select name="day" className="w-full p-2 border rounded-lg bg-white" required>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Start</label>
                            <input type="time" name="startTime" className="w-full p-2 border rounded-lg" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">End</label>
                            <input type="time" name="endTime" className="w-full p-2 border rounded-lg" required />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Subject</label>
                        <select name="subjectId" className="w-full p-2 border rounded-lg bg-white" required>
                            {subjects.length === 0 ? <option value="">No Subjects Found</option> : null}
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Teacher (Optional)</label>
                        <select name="teacherId" className="w-full p-2 border rounded-lg bg-white">
                            <option value="">-- No Teacher --</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.specialization})</option>)}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-zinc-800 transition mt-2">
                        Add to Schedule
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
}