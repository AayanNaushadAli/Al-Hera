import { prisma } from "@/lib/prisma";
import { ClassForm } from "@/components/forms/ClassForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AddClassPage() {
  // Fetch teachers for the dropdown
  const teachers = await prisma.teacher.findMany({
    orderBy: { fullName: 'asc' }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/classes"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create New Class</h1>
          <p className="text-zinc-500">Add a new grade level or section.</p>
        </div>
      </div>

      <ClassForm teachers={teachers} />
    </div>
  );
}