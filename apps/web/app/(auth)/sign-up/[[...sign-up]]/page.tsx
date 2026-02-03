import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-50">
      <SignUp />
    </div>
  );
}