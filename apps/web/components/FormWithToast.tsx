"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

type FormState = {
    message?: string;
    success?: boolean;
} | null;

interface FormWithToastProps {
    children: React.ReactNode;
    action: (prevState: FormState, formData: FormData) => Promise<FormState>;
    className?: string;
    successMessage?: string;
}

export function FormWithToast({
    children,
    action,
    className = "",
    successMessage = "Saved successfully!"
}: FormWithToastProps) {
    const [state, formAction, isPending] = useActionState(action, null);

    useEffect(() => {
        if (state?.message) {
            if (state.success === false) {
                toast.error(state.message);
            } else {
                toast.success(state.message);
            }
        }
    }, [state]);

    return (
        <form action={formAction} className={className}>
            {children}
        </form>
    );
}

// Simple submit button with loading state
interface SubmitButtonProps {
    children: React.ReactNode;
    className?: string;
    pendingText?: string;
}

export function SubmitButton({
    children,
    className = "",
    pendingText = "Saving..."
}: SubmitButtonProps) {
    // This component should be used inside FormWithToast
    // For now, it's a regular button - we'll enhance it later
    return (
        <button type="submit" className={className}>
            {children}
        </button>
    );
}
