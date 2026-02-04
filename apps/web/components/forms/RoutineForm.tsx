"use client";

import { createRoutine } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";
import { useTransition } from "react";
import { Plus } from "lucide-react";

interface RoutineFormProps {
    classId: number;
    days: string[];
    subjects: { id: number; name: string }[];
    teachers: { id: number; fullName: string; specialization: string | null }[];
}

export function RoutineForm({ classId, days, subjects, teachers }: RoutineFormProps) {
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createRoutine(formData);
            if (result?.message) {
                toast.error(result.message);
            }
        });
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="classId" value={classId} />

            <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Day</label>
                <select name="day" className="w-full p-2 border rounded-lg bg-white" required>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Start</label>
                    <input type="time" name="startTime" className="w-full p-2 border rounded-lg" required />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">End</label>
                    <input type="time" name="endTime" className="w-full p-2 border rounded-lg" required />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Subject</label>
                <select name="subjectId" className="w-full p-2 border rounded-lg bg-white" required>
                    {subjects.length === 0 ? <option value="">No Subjects Found</option> : null}
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Teacher (Optional)</label>
                <select name="teacherId" className="w-full p-2 border rounded-lg bg-white">
                    <option value="">-- No Teacher --</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.specialization})</option>)}
                </select>
            </div>

            <SubmitButton className="w-full mt-2" pendingText="Adding...">
                Add to Schedule
            </SubmitButton>
        </form>
    );
}
