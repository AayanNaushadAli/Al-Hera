import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const user = await currentUser();

  // --- SCENARIO 1: NOT LOGGED IN ---
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center md:justify-center h-screen bg-zinc-50 space-y-4 pb-32 md:pb-0">
        <h1 className="text-4xl font-bold text-zinc-900">Al-Hera</h1>
        <p className="text-zinc-500">Please sign in to access your dashboard.</p>
        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-lg font-medium hover:bg-zinc-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // --- SCENARIO 2: LOGGED IN (Check DB) ---

  // A. Check by Clerk ID (The Normal Way)
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id }
  });

  // B. THE HEALER: If not found by ID, check by Email (The "Pending" Way)
  if (!dbUser) {
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (userEmail) {
      const pendingUser = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      // If we found a pending user (created by Admin), LINK THEM!
      if (pendingUser) {
        dbUser = await prisma.user.update({
          where: { id: pendingUser.id },
          data: { clerkId: user.id } // <--- Swap fake ID for Real ID
        });
      }
    }
  }

  // If STILL no user, AUTO-CREATE as STUDENT
  if (!dbUser) {
    const userEmail = user.emailAddresses[0]?.emailAddress;
    const userName = user.fullName || user.firstName || "New Student";

    // Create User with STUDENT role
    dbUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: userEmail || `${user.id}@placeholder.com`,
        fullName: userName,
        role: "STUDENT"
      }
    });

    // Also create a Student profile linked to this user
    await prisma.student.create({
      data: {
        userId: dbUser.id,
        fullName: userName,
        admissionNo: `AUTO-${Date.now()}`, // Temporary admission number
        // classId not set - Admin will assign later
      }
    });
  }

  // 🚦 REDIRECT BASED ON ROLE
  switch (dbUser.role) {
    case "ADMIN":
      redirect("/admin");
    case "TEACHER":
      redirect("/teacher");
    case "STUDENT":
      redirect("/student");
    case "PARENT":
      redirect("/parent");
    default:
      return <div>Unknown Role</div>;
  }
}