// app/login/page.tsx
import LoginCard from "@/components/LoginCard";
import LoginRightPanel from "@/components/LoginRightPanel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Space_Mono } from 'next/font/google';

// Accent monospace font to match landing page Swiss design
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Jika pengguna sudah login, arahkan ke dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className={`h-screen w-full overflow-hidden bg-white ${spaceMono.variable}`}>
      {/* Swiss Grid Layout */}
      <div className="h-screen lg:grid lg:grid-cols-12">
  {/* Navigation */}
  <div className="fixed top-0 left-0 right-0 z-20 h-16 flex items-center px-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 text-sm font-medium text-slate-800 hover:text-slate-900 transition-all duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="tracking-wide">Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Main Content Area - Left Side */}
  <div className="lg:col-span-5 flex flex-col justify-center p-8 pt-24 lg:pt-24 lg:p-16 xl:p-24 overflow-y-auto lg:overflow-hidden">
          <div className="max-w-md mx-auto lg:mx-0">
            {/* Swiss Typography Header */}
            <div className="mb-16">
              <div className="mb-8">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-4 font-mono">
                  Akses Akun Anda
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-none mb-4">
                  Masuk
                </h1>
                <div className="w-16 h-1 bg-slate-900"></div>
              </div>
              
              <p className="text-lg text-slate-600 leading-relaxed font-light text-balance">
                Akses platform pembelajaran yang dirancang untuk memaksimalkan potensi Anda.
              </p>
            </div>

            {/* Login Form */}
            <LoginCard />
          </div>
        </div>

        {/* Right Side - Background image with rotating subjects/quotes */}
        <div className="hidden lg:block lg:col-span-7 relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: "url('/assets/login.jpg')" }}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-slate-900/60" />
          {/* Content with transitions */}
          <LoginRightPanel />
          {/* Bottom Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
        </div>
      </div>
    </div>
  );
}
