// app/login/page.tsx

import LoginCard from "@/components/LoginCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  // Jika pengguna sudah login, arahkan langsung ke halaman utama
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex items-center justify-center h-screen bg-slate-100">
      <LoginCard />
    </main>
  );
}