"use client";

import { createClass } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";
import { useActionState } from "react";
import { useEffect } from "react";
import { Save } from "lucide-react";

interface ClassFormProps {
    teachers: { id: number; fullName: string; specialization: string | null }[];
}

export function ClassForm({ teachers }: ClassFormProps) {
    const initialState = { message: "", success: false };

    // Using a simple wrapper since we are handling redirection in the action or just toast
    // But since actions currently redirect, we primarily need the loading state and error handling
    // However, createClass currently redirects on success.
    // Let's use a transition-based approach similar to StudentForm for consistency with current actions

    // Actually, StudentForm used useTransition. Let's stick to that pattern as it works well with
    // actions that redirect.

    return (
        <ClassFormContent teachers={teachers} />
    );
}

import { useTransition } from "react";

function ClassFormContent({ teachers }: ClassFormProps) {
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createClass(formData);
            if (result?.message) {
                toast.error(result.message);
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Class Name</label>
                    <input
                        name="name"
                        required
                        placeholder="e.g. Grade 10"
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Capacity</label>
                    <input
                        name="capacity"
                        type="number"
                        defaultValue={30}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Class Supervisor (Teacher)</label>
                <select
                    name="supervisorId"
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                >
                    <option value="">-- Select a Teacher --</option>
                    {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.fullName} ({t.specialization})</option>
                    ))}
                </select>
            </div>

            <div className="pt-4">
                <SubmitButton className="w-full">
                    <Save size={18} />
                    Create Class
                </SubmitButton>
            </div>
        </form>
    );
}
