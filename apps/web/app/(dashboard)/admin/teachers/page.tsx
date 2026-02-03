import { prisma } from "@/lib/prisma";
import { deleteTeacher } from "@/lib/actions";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, User } from "lucide-react";

export default async function TeachersPage() {
    // 1. Fetch teachers with their linked User account
    const teachers = await prisma.teacher.findMany({
        orderBy: { id: 'desc' },
        include: { user: true }
    });

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Teachers</h1>
                    <p className="text-zinc-500">Manage your school's faculty.</p>
                </div>
                <Link
                    href="/admin/teachers/new"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition w-fit"
                >
                    <Plus size={16} />
                    Add Teacher
                </Link>
            </div>

            {/* SEARCH BAR (UI Only for now) */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[500px]">
                    <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
                        <tr>
                            <th className="px-4 md:px-6 py-4">Full Name</th>
                            <th className="px-4 md:px-6 py-4">Specialization</th>
                            <th className="px-4 md:px-6 py-4">Email</th>
                            <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {teachers.length === 0 ? (
                            // EMPTY STATE
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="size-12 bg-zinc-100 rounded-full flex items-center justify-center mb-2">
                                            <User size={24} className="text-zinc-400" />
                                        </div>
                                        <p className="font-medium text-zinc-900">No teachers found</p>
                                        <p className="text-xs">Click "Add Teacher" to create one.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            // DATA STATE
                            teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-zinc-50 transition group">
                                    <td className="px-4 md:px-6 py-4 font-medium text-zinc-900">
                                        {teacher.fullName}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-zinc-500">
                                        {teacher.specialization || "N/A"}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-zinc-500">
                                        {teacher.user?.email || "No Email"}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">

                                            {/* EDIT BUTTON */}
                                            <Link
                                                href={`/admin/teachers/${teacher.id}`}
                                                className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                            {/* DELETE BUTTON (Form) */}
                                            <form action={async (formData) => {
                                                "use server";
                                                await deleteTeacher(formData);
                                            }}>
                                                <input type="hidden" name="id" value={teacher.id} />
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