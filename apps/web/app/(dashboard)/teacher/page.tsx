import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
  const user = await currentUser();
  if (!user) redirect("/");

  // CORRECT WAY: Find the User by Clerk ID, and include the Teacher Profile
  const dbUser = await prisma.user.findUnique({
    where: { 
      clerkId: user.id 
    },
    include: { 
      teacherProfile: true 
    }
  });

  // Security Check: If they aren't a teacher or don't have a profile, kick them out
  if (!dbUser || dbUser.role !== "TEACHER" || !dbUser.teacherProfile) {
     return (
       <div className="flex h-screen items-center justify-center text-red-500 bg-red-50">
         <div className="text-center space-y-2">
           <h1 className="text-2xl font-bold">⛔ Access Denied</h1>
           <p>You must be a registered Teacher to view this page.</p>
         </div>
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900">
        Hello, {dbUser.teacherProfile.fullName}! 👋
      </h1>
      <p className="text-zinc-500">Here is your daily overview.</p>
      
      <div className="p-12 border-2 border-dashed border-zinc-200 rounded-xl text-center text-zinc-400">
        Your Schedule and Classes will appear here.
      </div>
    </div>
  );
}