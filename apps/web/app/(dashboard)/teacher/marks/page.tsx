import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileEdit, ChevronRight, BookOpen } from "lucide-react";

export default async function TeacherMarksSelectPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { teacherProfile: true }
  });

  if (!dbUser?.teacherProfile) redirect("/");

  // 1. Fetch Exams (We assume exams are global for now)
  const exams = await prisma.exam.findMany({
    orderBy: { id: 'desc' } // Newest exams first
  });

  // 2. Fetch Classes/Subjects this teacher teaches
  // This is a bit complex: We need to find classes where this teacher is assigned in the routine
  const myClasses = await prisma.class.findMany({
    where: {
      routines: { some: { teacherId: dbUser.teacherProfile.id } }
    },
    include: {
        subjects: true // simpler: just show all subjects for that class for now
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Enter Marks</h1>
        <p className="text-zinc-500">Select an exam and class to start grading.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.length === 0 ? (
            <div className="col-span-full p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl">
                <p className="text-zinc-500">No active exams found. Ask an Admin to create one.</p>
            </div>
        ) : (
            exams.map((exam) => (
                <div key={exam.id} className="space-y-4">
                    <h3 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
                        <FileEdit className="text-blue-500" size={20} />
                        {exam.name} <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">{exam.term}</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-2">
                        {myClasses.map(cls => (
                            <div key={cls.id} className="bg-white border border-zinc-200 rounded-lg p-4">
                                <h4 className="font-bold text-zinc-800 mb-2">{cls.name}</h4>
                                <div className="space-y-1">
                                    {/* Link to Grading Page: /teacher/marks/EXAM_ID/CLASS_ID/SUBJECT_ID */}
                                    {cls.subjects.map(subject => (
                                        <Link 
                                            key={subject.id}
                                            href={`/teacher/marks/${exam.id}/${cls.id}/${subject.id}`}
                                            className="block text-sm p-2 hover:bg-zinc-50 rounded flex justify-between items-center group transition"
                                        >
                                            <span className="text-zinc-600 group-hover:text-black flex items-center gap-2">
                                                <BookOpen size={14} /> {subject.name}
                                            </span>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-blue-500" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}