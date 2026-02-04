import { prisma } from "@/lib/prisma";
import { StudentForm } from "@/components/forms/StudentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AddStudentPage() {
  // Fetch existing classes for the dropdown
  const classes = await prisma.class.findMany();

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/students"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Add New Student</h1>
          <p className="text-zinc-500">Enroll a new student into the system.</p>
        </div>
      </div>

      {/* FORM - Now with Toast Notifications */}
      <StudentForm classes={classes} />
    </div>
  );
}