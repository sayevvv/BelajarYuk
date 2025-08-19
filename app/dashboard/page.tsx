// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardOverviewPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  const s: any = session || {};
  if (!s?.user?.id) {
    // force auth for dashboard
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-8 bg-white">
        <h1 className="text-2xl font-bold text-slate-800">Silakan Login</h1>
        <p className="mt-2 text-slate-600 max-w-md">Masuk untuk melihat ringkasan dan melanjutkan belajar.</p>
        <Link href="/login?callbackUrl=/dashboard" className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  const [countAll, countPublished, recent] = await Promise.all([
    prisma.roadmap.count({ where: { userId: s.user.id } }),
    prisma.roadmap.count({ where: { userId: s.user.id, published: true } }),
    prisma.roadmap.findMany({ where: { userId: s.user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <header className="p-8 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Ringkasan cepat dan tindakan kilat.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/dashboard/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Buat Roadmap Baru</Link>
          <Link href="/dashboard/browse" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Jelajahi Publik</Link>
          <Link href="/dashboard/roadmaps" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Roadmap Saya</Link>
        </div>
      </header>
      <div className="p-8 space-y-8">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm text-slate-500">Total Roadmap</div>
              <div className="mt-1 text-2xl font-bold text-slate-800">{countAll}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm text-slate-500">Terpublikasi</div>
              <div className="mt-1 text-2xl font-bold text-slate-800">{countPublished}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm text-slate-500">Draf Aktif</div>
              <div className="mt-1 text-2xl font-bold text-slate-800">{Math.max(countAll - countPublished, 0)}</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Terakhir Dikerjakan</h2>
          {recent.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-slate-600">Belum ada roadmap. Mulai dari tombol "Buat Roadmap Baru".</div>
          ) : (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((r) => (
                <Link key={r.id} href={`/dashboard/roadmaps/${r.id}`} className="block rounded-xl border border-slate-200 bg-slate-50 p-5 hover:shadow-md hover:border-blue-300 transition-all">
                  <div className="font-semibold text-slate-800 truncate">{r.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{new Date(r.updatedAt).toLocaleString('id-ID')}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
