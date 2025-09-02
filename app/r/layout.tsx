"use client";

import DashboardSidebar from '@/components/DashboardSidebar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black">
      <DashboardSidebar />
      <main className="flex-1 overflow-hidden bg-white dark:bg-black">
        {children}
      </main>
    </div>
  );
}
