import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FileText, Award } from "lucide-react";

export default async function StudentGradesPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // 1. Get Student Profile
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { studentProfile: true }
  });

  if (!dbUser?.studentProfile) redirect("/");

  // 2. Fetch Marks (Include Exam and Subject details)
  const marks = await prisma.mark.findMany({
    where: { studentId: dbUser.studentProfile.id },
    include: {
      exam: true,
      subject: true
    },
    orderBy: { examId: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">My Grades</h1>
        <p className="text-zinc-500">View your academic performance and exam results.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {marks.length === 0 ? (
           <div className="py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl">
             <div className="inline-flex items-center justify-center size-12 bg-zinc-100 rounded-full mb-3">
               <FileText size={24} />
             </div>
             <h3 className="text-zinc-900 font-medium">No Grades Released</h3>
             <p className="text-sm mt-1">
               Your exam results have not been published yet.
             </p>
           </div>
        ) : (
          marks.map((mark) => (
            <div key={mark.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* LEFT: Subject & Exam Info */}
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                    Number(mark.marksObtained) >= 50 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                    {/* Get Grade letter if exists, otherwise calc simplistic Pass/Fail icon */}
                    {mark.grade || (Number(mark.marksObtained) >= 50 ? "P" : "F")}
                </div>
                <div>
                    <h3 className="font-bold text-zinc-900 text-lg">{mark.subject.name}</h3>
                    <p className="text-sm text-zinc-500">{mark.exam.name} ({mark.exam.term})</p>
                </div>
              </div>

              {/* RIGHT: Score */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                    <span className="block text-2xl font-bold text-zinc-900">
                        {String(mark.marksObtained)} <span className="text-sm text-zinc-400 font-normal">/ {String(mark.totalMarks)}</span>
                    </span>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Score</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}