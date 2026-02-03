import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ParentDashboard() {
  const user = await currentUser();
  if (!user) redirect("/");

  // 1. Fetch Parent & Their Children
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { 
      parentProfile: {
        include: {
          children: {
            include: { class: true }
          }
        }
      } 
    }
  });

  if (!dbUser || dbUser.role !== "PARENT" || !dbUser.parentProfile) {
     return <div className="p-12 text-red-500">⛔ Access Denied: Not a Parent account.</div>;
  }

  const parent = dbUser.parentProfile;
  const children = parent.children;

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">
            Welcome, {parent.fullName}! 👋
        </h1>
        <p className="text-zinc-500 mt-2">
            Track your children's progress, attendance, and grades here.
        </p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <GraduationCap className="text-indigo-600" />
            My Children
        </h2>

        {children.length === 0 ? (
            <div className="p-8 bg-zinc-100 rounded-xl text-center text-zinc-500">
                No students are linked to your profile yet. <br />
                Please contact the school admin.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children.map(child => (
                    <div key={child.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                                {child.fullName[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">{child.fullName}</h3>
                                <p className="text-sm text-zinc-500">Class: {child.class?.name || "N/A"}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 mt-4 pt-4 border-t border-zinc-100">
                             <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Admission No:</span>
                                <span className="font-medium text-zinc-900">{child.admissionNo}</span>
                             </div>
                        </div>

                        <Link 
                           href={`/parent/children/${child.id}`} // We will build this detail view later
                           className="mt-6 flex items-center justify-center w-full py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition gap-2 text-sm"
                        >
                           View Full Profile <ArrowRight size={16} />
                        </Link>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}