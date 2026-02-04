"use client";

import { createExam } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";
import { useTransition } from "react";
import { Save } from "lucide-react";

export function ExamForm() {
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createExam(formData);
            if (result?.message) {
                toast.error(result.message);
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Exam Name</label>
                    <input
                        name="name"
                        required
                        type="text"
                        placeholder="e.g. Mid-Term 2024"
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Term / Semester</label>
                    <select
                        name="term"
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/5"
                    >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                    </select>
                </div>
            </div>

            <div className="pt-4">
                <SubmitButton className="w-full">
                    <Save size={18} />
                    Create Exam
                </SubmitButton>
            </div>
        </form>
    );
}
