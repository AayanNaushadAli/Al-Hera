"use client";

import { createSubject } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";
import { useTransition } from "react";
import { Save } from "lucide-react";

interface SubjectFormProps {
    classes: { id: number; name: string; section: string | null }[];
}

export function SubjectForm({ classes }: SubjectFormProps) {
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createSubject(formData);
            if (result?.message) {
                toast.error(result.message);
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Subject Name</label>
                    <input
                        name="name"
                        required
                        type="text"
                        placeholder="e.g. Advanced Mathematics"
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Assign to Class</label>
                    <select
                        name="classId"
                        required
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                    >
                        <option value="">-- Select Class --</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.name} {cls.section ? `(${cls.section})` : ""}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-4">
                <SubmitButton className="w-full">
                    <Save size={18} />
                    Create Subject
                </SubmitButton>
            </div>
        </form>
    );
}
