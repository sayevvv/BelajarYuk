"use client";

import { useEffect, useMemo, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type ThemeMode = 'light' | 'dark' | 'system';

export default function ThemeToggle({ className = "", expanded = false }: { className?: string; expanded?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>('system');
  const mq = useMemo(() => (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null), []);
  const isDark = mode === 'dark' || (mode === 'system' && !!mq?.matches);

  // Initialize from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme') as ThemeMode | null;
      const initial: ThemeMode = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
      setMode(initial);
      const preferDark = mq?.matches ?? false;
      document.documentElement.classList.toggle('dark', initial === 'dark' || (initial === 'system' && preferDark));
    } catch {
      setMode('system');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to system changes when in system mode
  useEffect(() => {
    if (!mq) return;
    const handler = () => {
      if (mode === 'system') {
        document.documentElement.classList.toggle('dark', mq.matches);
      }
    };
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [mq, mode]);

  const apply = (next: ThemeMode) => {
    setMode(next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    const preferDark = mq?.matches ?? false;
    const enableDark = next === 'dark' || (next === 'system' && preferDark);
    document.documentElement.classList.toggle('dark', enableDark);
  };

  const cycleCollapsed = () => {
    const order: ThemeMode[] = ['light', 'system', 'dark'];
    const idx = order.indexOf(mode);
    const next = order[(idx + 1) % order.length];
    apply(next);
  };

  if (expanded) {
    return (
      <div className={`inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden ${className}`} role="group" aria-label="Theme selector">
        <button
          type="button"
          onClick={() => apply('light')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm ${mode === 'light' ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300'}`}
          title="Light"
          aria-pressed={mode === 'light'}
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => apply('system')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm ${mode === 'system' ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300'}`}
          title="System"
          aria-pressed={mode === 'system'}
        >
          <Monitor className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => apply('dark')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm ${mode === 'dark' ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300'}`}
          title="Dark"
          aria-pressed={mode === 'dark'}
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Collapsed: single button cycles modes
  const Icon = mode === 'dark' ? Sun : mode === 'light' ? Moon : Monitor;
  const label = mode === 'dark' ? 'Switch theme (dark)' : mode === 'light' ? 'Switch theme (light)' : 'Switch theme (system)';
  return (
    <button
      type="button"
      onClick={cycleCollapsed}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 ${className}`}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
