// app/dashboard/page.tsx
import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  // Arahkan pengguna langsung ke halaman pembuatan roadmap baru
  redirect('/dashboard/new');
}
