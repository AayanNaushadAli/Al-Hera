"use client";

import { createStudent } from "@/lib/actions";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

interface StudentFormProps {
    classes: { id: number; name: string; section: string | null }[];
}

export function StudentForm({ classes }: StudentFormProps) {
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createStudent(formData);
            if (result?.message) {
                toast.error(result.message);
            }
            // If no error message, redirect happens automatically
        });
    }

    return (
        <form action={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
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
                    disabled={isPending}
                    className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Enroll Student
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
