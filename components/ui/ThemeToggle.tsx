"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const enableDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.classList.toggle('dark', enableDark);
      setIsDark(enableDark);
    } catch {
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
    try {
      const next = !isDark;
      setIsDark(next);
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`inline-flex items-center justify-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 ${className}`}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
