import { ParentForm } from "@/components/forms/ParentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddParentPage() {
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/parents" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Add Parent</h1>
          <p className="text-zinc-500">Create a guardian profile.</p>
        </div>
      </div>

      <ParentForm />
    </div>
  );
}