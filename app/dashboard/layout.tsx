// app/dashboard/layout.tsx
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Layout utama untuk dashboard dengan sidebar
    <div className="flex h-screen bg-slate-50 dark:bg-black">
      <DashboardSidebar />
      <main className="flex-1 overflow-hidden bg-white dark:bg-black">
        {children}
      </main>
    </div>
  );
}
