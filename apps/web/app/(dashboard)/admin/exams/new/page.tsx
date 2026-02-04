import { ExamForm } from "@/components/forms/ExamForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddExamPage() {
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/exams" className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create Exam Session</h1>
          <p className="text-zinc-500">Define a new examination period.</p>
        </div>
      </div>

      <ExamForm />
    </div>
  );
}