// app/dashboard/roadmaps/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import RoadmapGridClient from '@/components/RoadmapGridClient';

export default async function RoadmapIndexPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-8 bg-white">
        <h1 className="text-2xl font-bold text-slate-800">Akses Ditolak</h1>
        <p className="mt-2 text-slate-600 max-w-md">Login untuk melihat koleksi roadmap Anda.</p>
        <Link href="/login?callbackUrl=/dashboard/roadmaps" className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">Login</Link>
      </div>
    );
  }

  const items = await prisma.roadmap.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: 'desc' } });

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-black">
      <header className="p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Roadmap Saya</h1>
      </header>
  <div className="p-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Belum Ada Roadmap</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Mulai dari membuat roadmap baru.</p>
            <Link href="/dashboard/new" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">Buat Rencana Baru</Link>
          </div>
        ) : (
          <RoadmapGridClient items={items as any} />
        )}
      </div>
    </div>
  );
}
