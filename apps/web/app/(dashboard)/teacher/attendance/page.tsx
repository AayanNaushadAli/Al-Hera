import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckSquare, ChevronRight, Users } from "lucide-react";

export default async function TeacherAttendanceSelectPage() {
    const user = await currentUser();
    if (!user) redirect("/");

    // 1. Get Teacher Profile
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
        include: { teacherProfile: true }
    });

    if (!dbUser?.teacherProfile) redirect("/");

    // 2. Find Classes linked to this teacher via Schedule
    const myClasses = await prisma.class.findMany({
        where: {
            routines: {
                some: { teacherId: dbUser.teacherProfile.id }
            }
        },
        include: {
            _count: { select: { students: true } }
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">Mark Attendance</h1>
                <p className="text-zinc-500">Select a class to record daily attendance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myClasses.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-xl">
                        You are not assigned to any classes yet.
                    </div>
                ) : (
                    myClasses.map((cls) => (
                        <Link
                            key={cls.id}
                            href={`/teacher/attendance/${cls.id}`} // Links to the marking page
                            className="group bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-blue-500 transition flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                                    <CheckSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 text-lg">
                                        {cls.name} {cls.section ? `(${cls.section})` : ""}
                                    </h3>
                                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Users size={12} />
                                        {cls._count.students} Students
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="text-zinc-300 group-hover:text-blue-500 transition" />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}