import { prisma } from "@/lib/prisma";
import { updateStudent } from "@/lib/actions";
import { SubmitButton } from "@/components/SubmitButton"; // Let's use your new button!
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const studentId = parseInt(id);

  if (isNaN(studentId)) return <div>Invalid ID</div>;

  // 1. Fetch Student, Classes, AND Parents
  const [student, classes, parents] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    }),
    prisma.class.findMany(),
    prisma.parent.findMany({ orderBy: { fullName: 'asc' } }) // Fetch parents alphabetically
  ]);

  if (!student) notFound();

  const nameParts = student.fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Edit Student</h1>
          <p className="text-zinc-500">Update enrollment & guardian details.</p>
        </div>
      </div>

      <form action={async (formData) => {
        "use server";
        await updateStudent(formData);
      }} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
        <input type="hidden" name="id" value={student.id} />

        {/* PERSONAL DETAILS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Student Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">First Name</label>
              <input name="name" defaultValue={firstName} required type="text" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Last Name</label>
              <input name="surname" defaultValue={lastName} required type="text" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Email Address</label>
            <input name="email" defaultValue={student.user?.email} required type="email" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Admission Number</label>
            <input name="admissionNo" defaultValue={student.admissionNo} required type="text" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
          </div>
        </div>

        <div className="h-px bg-zinc-100 my-4" />

        {/* ACADEMIC INFO */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Academic Info</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Assign Class</label>
            <select
              name="classId"
              defaultValue={student.classId || ""}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg bg-white"
            >
              <option value="">-- No Class Assigned --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} {cls.section ? `(${cls.section})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-px bg-zinc-100 my-4" />

        {/* PARENT LINKING (NEW SECTION) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Guardian Info</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Link Parent</label>
            <select
              name="parentId"
              defaultValue={student.parentId || ""}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg bg-white"
            >
              <option value="">-- No Parent Linked --</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.fullName} {parent.phone ? `(${parent.phone})` : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-500">
              Don't see the parent? <Link href="/admin/parents/new" className="text-blue-600 hover:underline">Create one here</Link>.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <SubmitButton label="Update Student Profile" />
        </div>
      </form>
    </div>
  );
}