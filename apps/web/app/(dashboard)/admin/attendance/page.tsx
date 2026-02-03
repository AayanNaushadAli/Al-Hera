import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckSquare, ChevronRight, Users } from "lucide-react";

export default async function AttendanceSelectionPage() {
  const classes = await prisma.class.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { students: true } } }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Attendance</h1>
        <p className="text-zinc-500">Select a class to mark daily attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length === 0 ? (
           <div className="col-span-full text-center py-12 text-zinc-500">
             No classes found.
           </div>
        ) : (
          classes.map((cls) => (
            <Link 
              key={cls.id} 
              href={`/admin/attendance/${cls.id}`}
              className="group bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-black transition flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
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
              <ChevronRight className="text-zinc-300 group-hover:text-black transition" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}