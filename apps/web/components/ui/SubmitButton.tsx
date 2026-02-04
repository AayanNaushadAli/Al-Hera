"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
    children: React.ReactNode;
    className?: string;
    pendingText?: string;
    variant?: "primary" | "danger" | "secondary";
}

export function SubmitButton({
    children,
    className = "",
    pendingText = "Saving...",
    variant = "primary"
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    const baseStyles = "font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-black text-white hover:bg-zinc-800",
        danger: "bg-red-500 text-white hover:bg-red-600",
        secondary: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
    };

    return (
        <button
            type="submit"
            disabled={pending}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {pending ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    {pendingText}
                </>
            ) : (
                children
            )}
        </button>
    );
}

// Small delete button with loading state
interface DeleteButtonProps {
    className?: string;
}

export function DeleteButton({ className = "" }: DeleteButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 ${className}`}
        >
            {pending ? (
                <Loader2 size={18} className="animate-spin text-red-500" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            )}
        </button>
    );
}
