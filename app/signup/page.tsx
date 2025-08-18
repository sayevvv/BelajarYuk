// app/signup/page.tsx
import SignupCard from "@/components/SignupCard";
import LoginRightPanel from "@/components/LoginRightPanel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      <div className="h-screen lg:grid lg:grid-cols-12">
        {/* Navigation */}
        <div className="fixed top-0 left-0 right-0 z-20 h-16 flex items-center px-8">
          <Link href="/login" className="inline-flex items-center gap-3 text-sm font-medium text-slate-800 hover:text-slate-900 transition-all duration-200 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="tracking-wide">Kembali ke Masuk</span>
          </Link>
        </div>

        {/* Left */}
        <div className="lg:col-span-5 flex flex-col justify-center p-8 pt-24 lg:pt-24 lg:p-16 xl:p-24 overflow-y-auto lg:overflow-hidden">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="mb-16">
              <div className="mb-8">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-4 font-mono">Buat Akun Baru</div>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-none mb-4">Daftar</h1>
                <div className="w-16 h-1 bg-slate-900"></div>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-light text-balance">Mulai perjalanan belajar Anda dengan kurasi roadmap yang relevan.</p>
            </div>

            <SignupCard />
            <p className="mt-6 text-sm text-slate-600">Sudah punya akun? <Link href="/login" className="text-slate-900 underline underline-offset-4">Masuk</Link></p>
          </div>
        </div>

        {/* Right */}
        <div className="hidden lg:block lg:col-span-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('/assets/login.jpg')" }} />
          <div className="absolute inset-0 bg-slate-900/60" />
          <LoginRightPanel />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
        </div>
      </div>
    </div>
  );
}
