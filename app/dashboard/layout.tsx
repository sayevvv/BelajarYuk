// app/dashboard/layout.tsx
"use client";

import DashboardSidebar from '@/components/DashboardSidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = /^\/dashboard\/roadmaps\/[^/]+\/read$/.test(pathname || '');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black">
      {!isReader && <DashboardSidebar />}
      <main className="flex-1 overflow-hidden bg-white dark:bg-black">
        {children}
      </main>
    </div>
  );
}
