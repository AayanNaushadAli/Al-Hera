import { createTeacher } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AddTeacherPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/teachers"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Add New Teacher</h1>
          <p className="text-zinc-500">Create a profile for a faculty member.</p>
        </div>
      </div>

      {/* FORM */}
      <form action={async (formData) => {
        "use server";
        await createTeacher(formData);
      }} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">

        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Personal Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">First Name</label>
              <input
                name="name"
                required
                type="text"
                placeholder="e.g. John"
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Last Name</label>
              <input
                name="surname"
                required
                type="text"
                placeholder="e.g. Doe"
                className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Email Address</label>
            <input
              name="email"
              required
              type="email"
              placeholder="john.doe@school.edu"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        <div className="h-px bg-zinc-100 my-4" />

        {/* Professional Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Professional Info</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Specialization (Subject)</label>
            <select
              name="specialization"
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
            >
              <option value="">Select a subject...</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Create Teacher Profile
          </button>
        </div>

      </form>
    </div>
  );
}