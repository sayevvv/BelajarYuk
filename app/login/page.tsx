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
            className="inline-flex items-center gap-3 text-sm font-medium text-slate-800 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="tracking-wide">Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Main Content Area - Left Side */}
  <div className="lg:col-span-5 flex flex-col justify-center p-6 pt-20 lg:p-10 xl:p-12 overflow-y-auto lg:overflow-hidden min-h-[calc(100vh-4rem)]">
          <div className="max-w-sm mx-auto">
            {/* Compact header */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">Masuk</span>
              <h1 className="mt-3 text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">Selamat datang kembali</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">Masuk untuk melanjutkan belajar.</p>
            </div>

            {/* Login Form */}
            <div className="mt-4">
               <LoginCard />
             </div>
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
