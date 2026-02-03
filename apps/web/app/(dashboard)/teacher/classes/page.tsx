import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, ChevronRight } from "lucide-react";

export default async function MyClassesPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // 1. Get Teacher Profile
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { teacherProfile: true }
  });

  if (!dbUser?.teacherProfile) redirect("/");

  // 2. Find Classes where this teacher has at least one routine/session
  // This is the magic query: "Find classes where the routine list has THIS teacher"
  const myClasses = await prisma.class.findMany({
    where: {
      routines: {
        some: {
          teacherId: dbUser.teacherProfile.id
        }
      }
    },
    include: {
      _count: { select: { students: true } }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">My Classes</h1>
          <p className="text-zinc-500">Classes assigned to you in the schedule.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myClasses.length === 0 ? (
           <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-xl">
             <div className="inline-flex items-center justify-center size-12 bg-zinc-100 rounded-full mb-3 text-zinc-400">
                <BookOpen size={24} />
             </div>
             <h3 className="text-zinc-900 font-medium">No Classes Found</h3>
             <p className="text-zinc-500 text-sm mt-1">
               You haven't been assigned to any schedule routines yet.
               <br />Ask an Admin to assign you to a subject in the schedule.
             </p>
           </div>
        ) : (
          myClasses.map((cls) => (
            <div key={cls.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:border-black transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                   <div className="size-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                     {cls.name.charAt(0)}
                   </div>
                   <span className="text-xs font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase">
                     {cls.section || "Gen"}
                   </span>
                </div>
                
                <h3 className="font-bold text-zinc-900 text-lg">
                  {cls.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                  <Users size={14} />
                  {cls._count.students} Students
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-50">
                  <Link 
                    href={`/teacher/classes/${cls.id}`} 
                    className="flex items-center justify-between text-sm font-bold text-black group-hover:text-blue-600 transition"
                  >
                    View Class Details <ChevronRight size={16} />
                  </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}