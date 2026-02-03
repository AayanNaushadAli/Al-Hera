import { prisma } from "@/lib/prisma";
import { updateTeacher } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";

// Define params type as a Promise
export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Fetch the teacher to pre-fill the form
    // In Next.js 15+, params is a Promise that must be awaited
    const { id } = await params;
    const teacherId = parseInt(id);

    if (isNaN(teacherId)) {
        return <div>Invalid Teacher ID</div>;
    }

    const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        include: { user: true }
    });

    if (!teacher) notFound();

    // Split full name for the form inputs (Simple logic)
    const nameParts = teacher.fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/teachers" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Edit Teacher</h1>
                    <p className="text-zinc-500">Update profile details for {teacher.fullName}.</p>
                </div>
            </div>

            <form action={async (formData) => {
                "use server";
                await updateTeacher(formData);
            }} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
                {/* HIDDEN ID FIELD - Crucial for the update action to know WHO to update */}
                <input type="hidden" name="id" value={teacher.id} />

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">First Name</label>
                            <input
                                name="name"
                                defaultValue={firstName}
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Last Name</label>
                            <input
                                name="surname"
                                defaultValue={lastName}
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Email Address</label>
                        <input
                            name="email"
                            defaultValue={teacher.user?.email}
                            required
                            type="email"
                            className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                </div>

                <div className="h-px bg-zinc-100 my-4" />

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Professional Info</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Specialization</label>
                        <select
                            name="specialization"
                            defaultValue={teacher.specialization || ""}
                            className="w-full px-4 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/5"
                        >
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="History">History</option>
                            <option value="Computer Science">Computer Science</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2">
                        <Save size={18} />
                        Update Teacher
                    </button>
                </div>
            </form>
        </div>
    );
}