import { prisma } from "@/lib/prisma";
import { SubjectForm } from "@/components/forms/SubjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AddSubjectPage() {
  // Fetch classes for the dropdown
  const classes = await prisma.class.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/subjects" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Add Subject</h1>
          <p className="text-zinc-500">Create a new course for a specific class.</p>
        </div>
      </div>

      <SubjectForm classes={classes} />
    </div>
  );
}