"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function LandingHeader() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
          <Link href="/" className="px-4">
            <Image src="/logo/dark.png" alt="BelajarYuk" width={120} height={20} priority />
          </Link>
          <nav className="hidden md:flex items-center gap-6 pr-3">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</Link>
            <Link href="#metrics" className="text-sm font-medium text-slate-600 hover:text-slate-900">About</Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
            <span aria-hidden className="mx-2 h-6 w-px bg-slate-200" />
            <Link href="/dashboard" className="ml-1 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Start Learning
            </Link>
          </nav>
          <Link href="/dashboard" className="md:hidden inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}
