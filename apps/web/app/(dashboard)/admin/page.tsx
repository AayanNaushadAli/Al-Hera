import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CountChart from "@/components/CountChart";       // <--- Import
import AttendanceChart from "@/components/AttendanceChart"; // <--- Import

export default async function AdminDashboard() {
    // 1. Get logged in user
    const user = await currentUser();
    if (!user) redirect("/");

    // 2. Double check database role for security
    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id }
    });

    // 3. Kick them out if not Admin
    if (dbUser?.role !== "ADMIN") {
        return (
            <div className="flex h-screen items-center justify-center text-red-500 bg-red-50">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">⛔ Access Denied</h1>
                    <p>You must be an Administrator to view this page.</p>
                </div>
            </div>
        );
    }

    // 4. FETCH REAL DATA (This is the new part!) 🚀
    // We use Promise.all to fetch all 3 counts at the same time (faster)
    const [studentCount, teacherCount, classCount] = await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.class.count(),
    ]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Dashboard Overview</h1>
                    <p className="text-zinc-500 mt-1">Welcome back, {user.firstName}.</p>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition">
                    Download Report
                </button>
            </div>

            {/* Stats Grid - Now passing REAL variables! */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Students"
                    value={studentCount.toString()}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Total Teachers"
                    value={teacherCount.toString()}
                    color="bg-purple-600"
                />
                <StatCard
                    title="Active Classes"
                    value={classCount.toString()}
                    color="bg-orange-600"
                />
            </div>

            {/* CHARTS SECTION */}
            {/* CHARTS SECTION */}
            <div className="flex flex-col lg:flex-row gap-6 w-full lg:h-[450px]">
                {/* LEFT: Count Chart (1/3 width) */}
                <div className="w-full lg:w-1/3 h-[300px] lg:h-full">
                    <CountChart />
                </div>
                {/* RIGHT: Attendance Chart (2/3 width) */}
                <div className="w-full lg:w-2/3 h-[300px] lg:h-full">
                    <AttendanceChart />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string, value: string, color: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-zinc-500">{title}</p>
                <h3 className="text-3xl font-bold text-zinc-900 mt-2">{value}</h3>
            </div>
            <div className={`size-10 rounded-full ${color} opacity-20`} />
        </div>
    );
}