"use client";

import { DeleteButton } from "@/components/ui/SubmitButton";
import { deleteClass, deleteStudent, deleteTeacher, deleteSubject, deleteExam, deleteParent, deleteRoutine } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";

type DeleteAction = "class" | "student" | "teacher" | "subject" | "exam" | "parent" | "routine";

interface DeleteFormProps {
    id: number;
    action: DeleteAction;
    itemName?: string;
}

const actionLabels: Record<DeleteAction, string> = {
    class: "class",
    student: "student",
    teacher: "teacher",
    subject: "subject",
    exam: "exam",
    parent: "parent",
    routine: "routine",
};

export function DeleteForm({ id, action, itemName }: DeleteFormProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const actionMap = {
        class: deleteClass,
        student: deleteStudent,
        teacher: deleteTeacher,
        subject: deleteSubject,
        exam: deleteExam,
        parent: deleteParent,
        routine: deleteRoutine,
    };

    const deleteAction = actionMap[action];
    const label = actionLabels[action];

    async function handleDelete() {
        setIsDeleting(true);
        const formData = new FormData();
        formData.append("id", id.toString());

        const result = await deleteAction(formData);

        if (result?.message) {
            toast.error(result.message);
        } else {
            toast.success(`${label.charAt(0).toUpperCase() + label.slice(1)} deleted successfully`);
        }

        setIsDeleting(false);
        setShowConfirm(false);
    }

    return (
        <>
            {/* Delete Button - Opens Confirmation */}
            <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
                <Trash2 size={18} />
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
                    <div
                        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-zinc-900 text-center mb-2">
                            Delete {label}?
                        </h3>

                        {/* Message */}
                        <p className="text-sm text-zinc-500 text-center mb-6">
                            {itemName ? (
                                <>Are you sure you want to delete <strong>{itemName}</strong>? </>
                            ) : (
                                <>Are you sure you want to delete this {label}? </>
                            )}
                            This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg text-zinc-700 font-medium hover:bg-zinc-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
