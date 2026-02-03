"use client";

import { useFormStatus } from "react-dom";
import { Save, Loader2 } from "lucide-react";

export function SubmitButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save size={20} />
          {label}
        </>
      )}
    </button>
  );
}