// app/dashboard/layout.tsx
"use client";

import DashboardSidebar from '@/components/DashboardSidebar';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReader = /^\/dashboard\/roadmaps\/[^/]+\/read$/.test(pathname || '');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black">
      {!isReader && (
        // Prevent sidebar from shrinking so main area recalculates width cleanly
        <div className="shrink-0">
          <DashboardSidebar />
        </div>
      )}
      {/* min-w-0 prevents flex overflow when children use max-width containers */}
  <main className="min-w-0 min-h-0 flex-1 overflow-hidden bg-white dark:bg-black">
        {children}
      </main>
    </div>
  );
}
