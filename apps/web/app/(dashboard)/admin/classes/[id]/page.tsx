import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Save, Users, Hash } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: PageProps) {
    const { id } = await params;
    const classId = parseInt(id);

    if (isNaN(classId)) return <div>Invalid Class ID</div>;

    // Fetch class with students
    const classItem = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            students: {
                orderBy: [
                    { rollNumber: 'asc' },
                    { fullName: 'asc' }
                ]
            },
            supervisor: true
        }
    });

    if (!classItem) notFound();

    // Server action to update roll numbers
    async function updateRollNumbers(formData: FormData) {
        "use server";

        const updates: { id: number; rollNumber: string }[] = [];

        // Parse form data for all students
        for (const [key, value] of formData.entries()) {
            if (key.startsWith("roll_")) {
                const studentId = parseInt(key.replace("roll_", ""));
                updates.push({
                    id: studentId,
                    rollNumber: value as string
                });
            }
        }

        // Update all students
        for (const update of updates) {
            await prisma.student.update({
                where: { id: update.id },
                data: { rollNumber: update.rollNumber || null }
            });
        }

        revalidatePath(`/admin/classes/${classId}`);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <Link href="/admin/classes" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">
                        {classItem.name} {classItem.section}
                    </h1>
                    <p className="text-zinc-500">
                        {classItem.supervisor ? `Supervisor: ${classItem.supervisor.fullName}` : "No supervisor assigned"}
                    </p>
                </div>
            </div>

            {/* CLASS INFO CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500">Total Students</p>
                            <p className="text-xl font-bold text-zinc-900">{classItem.students.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <Hash size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500">Capacity</p>
                            <p className="text-xl font-bold text-zinc-900">{classItem.capacity}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* STUDENTS LIST WITH ROLL NUMBER EDITING */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                    <h3 className="font-bold text-zinc-700 flex items-center gap-2">
                        <Users size={18} />
                        Students & Roll Numbers
                    </h3>
                    <span className="text-xs bg-zinc-200 px-2 py-1 rounded text-zinc-600">
                        {classItem.students.length} students
                    </span>
                </div>

                {classItem.students.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400">
                        No students in this class yet.
                    </div>
                ) : (
                    <form action={async (formData) => {
                        "use server";
                        await updateRollNumbers(formData);
                    }}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-zinc-500 font-medium border-b border-zinc-100">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 w-24">Roll No</th>
                                        <th className="px-4 md:px-6 py-3">Student Name</th>
                                        <th className="px-4 md:px-6 py-3 hidden sm:table-cell">Admission No</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {classItem.students.map(student => (
                                        <tr key={student.id} className="hover:bg-zinc-50">
                                            <td className="px-4 md:px-6 py-3">
                                                <input
                                                    type="text"
                                                    name={`roll_${student.id}`}
                                                    defaultValue={student.rollNumber || ""}
                                                    placeholder="--"
                                                    className="w-16 p-2 border border-zinc-200 rounded text-center font-mono font-bold text-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-4 md:px-6 py-3 font-medium text-zinc-900">
                                                {student.fullName}
                                            </td>
                                            <td className="px-4 md:px-6 py-3 text-zinc-500 hidden sm:table-cell">
                                                {student.admissionNo}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end">
                            <button
                                type="submit"
                                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-800 transition flex items-center gap-2"
                            >
                                <Save size={18} />
                                Save Roll Numbers
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
