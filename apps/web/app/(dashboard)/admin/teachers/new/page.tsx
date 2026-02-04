import { TeacherForm } from "@/components/forms/TeacherForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddTeacherPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/teachers"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Add New Teacher</h1>
          <p className="text-zinc-500">Create a profile for a faculty member.</p>
        </div>
      </div>

      {/* FORM - Now with Toast Notifications */}
      <TeacherForm />
    </div>
  );
}