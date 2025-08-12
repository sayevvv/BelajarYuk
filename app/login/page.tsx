// app/login/page.tsx
import LoginCard from "@/components/LoginCard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Komponen ilustrasi SVG abstrak yang sesuai dengan estetika Swiss Design
const LoginIllustration = () => (
  <div className="w-full max-w-md" aria-hidden="true">
    <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" rx="24" fill="#F1F5F9"/>
      <circle cx="150" cy="150" r="80" fill="#3B82F6" fillOpacity="0.1"/>
      <rect x="100" y="100" width="200" height="200" rx="12" stroke="#3B82F6" strokeWidth="4" strokeDasharray="8 8"/>
      <path d="M120 280L280 120" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="250" cy="250" r="30" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2"/>
      <circle cx="250" cy="250" r="10" fill="#3B82F6"/>
    </svg>
  </div>
);

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Jika pengguna sudah login, arahkan ke dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Kolom Kiri: Form Login */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 relative">
         <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
        </Link>
        <div className="w-full max-w-sm">
            <LoginCard />
        </div>
      </div>
      {/* Kolom Kanan: Ilustrasi */}
      <div className="hidden bg-slate-50 lg:flex flex-col items-center justify-center p-12 border-l border-slate-200">
        <div className="w-full max-w-md text-center">
            <LoginIllustration />
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-slate-900">
                    Strukturkan Pengetahuan Anda.
                </h2>
                <p className="mt-2 text-slate-600">
                    Buat jalur belajar yang jelas dari topik apa pun dan capai tujuan Anda lebih cepat.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
