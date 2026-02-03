import { prisma } from "@/lib/prisma";
import { deleteStudent } from "@/lib/actions"; // Import delete action
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, User } from "lucide-react";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { id: 'desc' },
    include: {
      user: true,
      class: true
    }
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Students</h1>
          <p className="text-zinc-500">Manage student enrollments.</p>
        </div>
        <Link
          href="/admin/students/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition"
        >
          <Plus size={16} />
          Add Student
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or admission no..."
          className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Admission No</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {students.length === 0 ? (
              // EMPTY STATE
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                      <User size={24} className="text-zinc-400" />
                    </div>
                    <p className="font-medium text-zinc-900">No students found</p>
                    <p className="text-xs">Click "Add Student" to enroll one.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // DATA STATE
              students.map((student) => (
                <tr key={student.id} className="hover:bg-zinc-50 transition group">
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {student.fullName}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {student.admissionNo}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {student.class?.name || "No Class"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {student.user?.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">

                      {/* EDIT BUTTON */}
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Pencil size={18} />
                      </Link>

                      {/* DELETE BUTTON */}
                      <form action={async (formData) => {
                        "use server";
                        await deleteStudent(formData);
                      }}>
                        <input type="hidden" name="id" value={student.id} />
                        <button
                          type="submit"
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}