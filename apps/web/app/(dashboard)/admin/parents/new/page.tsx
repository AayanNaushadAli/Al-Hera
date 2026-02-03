import { createParent } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

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

      <form action={createParent} className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm space-y-6">
        
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
            <label className="text-sm font-medium text-zinc-700">Phone</label>
            <input name="phone" type="tel" className="w-full px-4 py-2 border border-zinc-200 rounded-lg" />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Create Parent
          </button>
        </div>
      </form>
    </div>
  );
}