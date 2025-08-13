// app/dashboard/settings/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const current = document.documentElement.classList.contains('dark');
    setIsDark(current);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  };

  if (status === "loading") {
    return <div className="flex h-full items-center justify-center">Memuat pengaturan…</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>

        {/* Akun */}
        <section className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Akun</h2>
          {session ? (
            <div className="mt-4 flex items-center gap-4">
              {session.user?.image ? (
                <Image src={session.user.image} alt={session.user.name || "User"} width={64} height={64} className="rounded-full" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              )}
              <div>
                <div className="text-slate-900 dark:text-slate-100 font-semibold">{session.user?.name || "Pengguna"}</div>
                <div className="text-slate-600 dark:text-slate-300 text-sm">{session.user?.email}</div>
              </div>
              <div className="ml-auto">
                <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700">Keluar</button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-slate-600 dark:text-slate-300">Anda belum masuk.</p>
              <Link href="/login?callbackUrl=/dashboard/settings" className="inline-flex mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">Masuk</Link>
            </div>
          )}
        </section>

        {/* Tema */}
        <section className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tema</h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-200">Mode Gelap</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Aktifkan untuk tampilan yang lebih redup.</div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}
              title={isDark ? 'Matikan mode gelap' : 'Aktifkan mode gelap'}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
