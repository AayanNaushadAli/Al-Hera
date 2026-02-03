import { prisma } from "@/lib/prisma";
import { createStudent } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function AddStudentPage() {
  // 1. Fetch existing classes for the dropdown
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

      {/* FORM */}
      <form action={async (formData) => {
        "use server";
        await createStudent(formData);
      }} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">

        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Student Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">First Name</label>
              <input name="name" required type="text" placeholder="e.g. Alice" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Last Name</label>
              <input name="surname" required type="text" placeholder="e.g. Smith" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Email Address</label>
            <input name="email" required type="email" placeholder="student@school.edu" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Admission Number <span className="text-red-500">*</span></label>
            <input name="admissionNo" required type="text" placeholder="e.g. 2024-001 (Unique)" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Roll Number</label>
            <input name="rollNumber" type="text" placeholder="e.g. 1 (Class-specific, optional)" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
            <p className="text-xs text-zinc-400">Roll number within the class (not unique across school).</p>
          </div>
        </div>

        <div className="h-px bg-zinc-100 my-4" />

        {/* Academic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Academic Info</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Assign Class</label>
            <select
              name="classId"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
            >
              <option value="">-- Select a Class (Optional) --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.section ? `(${cls.section})` : ""}
                </option>
              ))}
            </select>
            {classes.length === 0 && (
              <p className="text-xs text-orange-500 mt-1">
                No classes found. You can assign one later after creating Classes.
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Enroll Student
          </button>
        </div>

      </form>
    </div>
  );
}