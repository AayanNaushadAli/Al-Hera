"use client";

import { createParent } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";
import { useTransition } from "react";
import { Save } from "lucide-react";

export function ParentForm() {
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await createParent(formData);
            if (result?.message) {
                toast.error(result.message);
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">First Name</label>
                        <input name="name" required type="text" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Last Name</label>
                        <input name="surname" required type="text" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Email Address</label>
                    <input name="email" required type="email" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">Phone <span className="text-red-500">*</span></label>
                    <input name="phone" required type="tel" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
                </div>
            </div>

            <div className="pt-4">
                <SubmitButton className="w-full">
                    <Save size={18} />
                    Create Parent
                </SubmitButton>
            </div>
        </form>
    );
}
