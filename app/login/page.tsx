// app/login/page.tsx
import LoginCard from "@/components/LoginCard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Jika pengguna sudah login, arahkan ke dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Kolom Kiri: Form Login */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white">
         <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
        </Link>
        <div className="w-full max-w-sm">
            <LoginCard />
        </div>
      </div>
      
      {/* Kolom Kanan: Teks Tipografi dengan Gambar Latar */}
      <div className="hidden lg:block relative">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/assets/login.jpg')" }}
        />
        <div className="relative z-10 flex h-full flex-col justify-end bg-black/40 p-12">
            <blockquote className="text-white">
                <p className="text-4xl font-bold leading-tight">
                    "Satu-satunya sumber pengetahuan adalah pengalaman."
                </p>
                <footer className="mt-4 text-lg font-medium text-white/80">
                    — Albert Einstein
                </footer>
            </blockquote>
        </div>
      </div>
    </div>
  );
}
