// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import RoadmapCard from '@/components/RoadmapCard';
import HomeStartBox from '@/components/HomeStartBox';
import { Suspense } from 'react';

export default async function DashboardHomePage() {
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

  // Query Recommended Topics (simple heuristic now: top 8 by total usage), Popular (by wilsonScore), For You (by overlap with user history or recent views)
  const [recommendedTopics, popular, forYou] = await Promise.all([
    // Recommend topics by global usage; if Topic table empty, returns []
    (async () => {
      try {
        // Count RoadmapTopic per topic, order desc
        const rows = await (prisma as any).roadmapTopic.groupBy({ by: ['topicId'], _count: { topicId: true }, orderBy: { _count: { topicId: 'desc' } }, take: 8 });
        const ids = rows.map((r: any) => r.topicId);
        const topics = await (prisma as any).topic.findMany({ where: { id: { in: ids } } });
        const byId: Record<string, any> = Object.fromEntries(topics.map((t: any) => [t.id, t]));
        return rows.map((r: any) => byId[r.topicId]).filter(Boolean);
      } catch { return []; }
    })(),
    // Popular public roadmaps: order by bayesianScore desc then ratingsCount
    (async () => {
      try {
        const items = await (prisma as any).roadmap.findMany({
          where: { published: true },
          orderBy: [{ createdAt: 'desc' }],
          take: 24,
          select: { id: true, title: true, slug: true },
        });
        // Join aggregates if available
        const agg = await (prisma as any).roadmapAggregates.findMany({ where: { roadmapId: { in: items.map((i: any) => i.id) } } });
        const byId: Record<string, any> = Object.fromEntries(agg.map((a: any) => [a.roadmapId, a]));
        return items
          .map((i: any) => ({ ...i, avgStars: byId[i.id]?.avgStars ?? 0, ratingsCount: byId[i.id]?.ratingsCount ?? 0 }))
          .sort((a: any, b: any) => (b.bayesianScore ?? 0) - (a.bayesianScore ?? 0) || (b.ratingsCount ?? 0) - (a.ratingsCount ?? 0))
          .slice(0, 12);
      } catch { return []; }
    })(),
    // For You: prioritize user’s own topics
    (async () => {
      try {
        const my = await (prisma as any).roadmap.findMany({ where: { userId: s.user.id }, select: { id: true } });
        const myIds = my.map((m: any) => m.id);
        const myTopics = await (prisma as any).roadmapTopic.findMany({ where: { roadmapId: { in: myIds } }, select: { topicId: true } });
        const topicIds = Array.from(new Set(myTopics.map((t: any) => t.topicId)));
        const candidates = await (prisma as any).roadmapTopic.findMany({ where: { topicId: { in: topicIds } }, select: { roadmapId: true } });
        const roadmapIds = Array.from(new Set(candidates.map((c: any) => c.roadmapId)));
        const items = await (prisma as any).roadmap.findMany({ where: { id: { in: roadmapIds }, published: true }, select: { id: true, title: true, slug: true }, take: 12 });
        const agg = await (prisma as any).roadmapAggregates.findMany({ where: { roadmapId: { in: items.map((i: any) => i.id) } } });
        const byId: Record<string, any> = Object.fromEntries(agg.map((a: any) => [a.roadmapId, a]));
        return items.map((i: any) => ({ ...i, avgStars: byId[i.id]?.avgStars ?? 0, ratingsCount: byId[i.id]?.ratingsCount ?? 0 }));
      } catch { return []; }
    })(),
  ]);

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Top search */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="relative flex-1">
            <input className="w-full rounded-full bg-slate-100 border border-slate-200 px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-200" placeholder="Cari roadmap, topik, atau materi" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
          <Link href="/dashboard/new" className="rounded-lg bg-slate-900 text-white text-sm font-semibold px-3 py-2">Buat Baru</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 px-6 py-6">
        {/* Main feed */}
        <div>
          <HomeStartBox />

          {/* Tabs */}
          <div className="mt-6 flex items-center gap-6 border-b border-slate-200">
            <button className="-mb-px border-b-2 border-slate-900 pb-3 text-sm font-semibold">For You</button>
            <button className="-mb-px border-b-2 border-transparent pb-3 text-sm text-slate-500 hover:text-slate-800">Popular</button>
          </div>

          {/* For You list */}
          <div className="mt-4 space-y-3">
            {forYou.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada rekomendasi personal. Mulai buat atau pelajari roadmap untuk melihat rekomendasi.</div>
            ) : (
              forYou.map((i: any) => <RoadmapCard key={i.id} item={i} />)
            )}
          </div>

          {/* Popular list */}
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Popular</h3>
            {popular.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada konten populer.</div>
            ) : (
              popular.map((i: any) => <RoadmapCard key={i.id} item={i} />)
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900">Recommended Topics</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {recommendedTopics.length === 0 ? (
                <span className="text-xs text-slate-500">Belum ada</span>
              ) : recommendedTopics.map((t: any) => (
                <Link key={t.id} href={`/dashboard/browse?topic=${encodeURIComponent(t.slug)}`} className="px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:bg-slate-100">{t.name}</Link>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Developer’s Choice</h3>
              <span className="text-slate-400" title="Kurasi manual, placeholder">i</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {/* Placeholder items */}
              <li className="text-slate-700">Panduan Belajar DevOps sampai Mahir
                <div className="text-xs text-slate-400">Deskripsi Singkat</div>
              </li>
              <li className="text-slate-700">Panduan Belajar React Lanjutan
                <div className="text-xs text-slate-400">Deskripsi Singkat</div>
              </li>
              <li className="text-slate-700">Data Science untuk Pemula
                <div className="text-xs text-slate-400">Deskripsi Singkat</div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
