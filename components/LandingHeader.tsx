"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ThemeToggle from './ui/ThemeToggle';

export default function LandingHeader() {
  const [dest, setDest] = useState<string>('/login?callbackUrl=%2Fdashboard%2Fnew');
  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/session').then(res => res.json()).then((data) => {
      if (!mounted) return;
      if (data?.user?.id) setDest('/dashboard/new');
      else setDest('/login?callbackUrl=%2Fdashboard%2Fnew');
    }).catch(() => setDest('/login?callbackUrl=%2Fdashboard%2Fnew'));
    return () => { mounted = false; };
  }, []);
  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <Link href="/" className="px-4 flex items-center">
            <Image src="/logo/dark.png" alt="BelajarYuk" width={120} height={20} priority className="block dark:hidden" />
            <Image src="/logo/light.png" alt="BelajarYuk" width={120} height={20} priority className="hidden dark:block" />
          </Link>
          <nav className="hidden md:flex items-center gap-3 pr-3">
            <ThemeToggle />
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Features</Link>
            <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">About</Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Login</Link>
            <span aria-hidden className="mx-2 h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <Link href={dest} className="ml-1 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500">
              Start Learning
            </Link>
          </nav>
          <Link href={dest} className="md:hidden inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500">
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}
