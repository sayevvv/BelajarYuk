// app/dashboard/layout.tsx
"use client";

import DashboardSidebar from '@/components/DashboardSidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = /^\/dashboard\/roadmaps\/[^/]+\/(read|quiz)$/.test(pathname || '');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black">
  {!isFullScreen && <DashboardSidebar />}
      <main className="flex-1 overflow-hidden bg-white dark:bg-black">
        {children}
      </main>
    </div>
  );
}
