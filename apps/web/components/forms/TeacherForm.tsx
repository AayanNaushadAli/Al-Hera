"use client";

import { createTeacher } from "@/lib/actions";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

export function TeacherForm() {
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createTeacher(formData);
            if (result?.message) {
                toast.error(result.message);
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">First Name</label>
                    <input name="name" required type="text" placeholder="e.g. John" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Last Name</label>
                    <input name="surname" required type="text" placeholder="e.g. Doe" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Email Address</label>
                <input name="email" required type="email" placeholder="teacher@school.edu" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Specialization</label>
                <input name="specialization" type="text" placeholder="e.g. Mathematics, Physics" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Add Teacher
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
