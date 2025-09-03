// app/dashboard/roadmaps/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import RoadmapGridClient from '@/components/RoadmapGridClient';
import RoadmapCard from '@/components/RoadmapCard';
import RoadmapSortSelect from '@/components/RoadmapSortSelect';

export default async function RoadmapIndexPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
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

  const sp = await searchParams;
  const sort = (typeof sp?.sort === 'string' ? sp?.sort : 'updated_desc') as string;
  const orderBy: any = (() => {
    switch (sort) {
      case 'updated_asc':
        return { updatedAt: 'asc' };
      case 'created_desc':
        return { createdAt: 'desc' };
      case 'created_asc':
        return { createdAt: 'asc' };
      case 'title_asc':
        return { title: 'asc' };
      case 'title_desc':
        return { title: 'desc' };
      case 'access_desc':
        return [{ progress: { updatedAt: 'desc' } }, { updatedAt: 'desc' }];
      case 'access_asc':
        return [{ progress: { updatedAt: 'asc' } }, { updatedAt: 'asc' }];
      default:
        return { updatedAt: 'desc' };
    }
  })();

  const items = await prisma.roadmap.findMany({ where: { userId: session.user.id }, orderBy });
  const own = items.filter((i: any) => !i.sourceId);
  // Attach topics for own roadmaps
  const ownTopicRows = own.length ? await (prisma as any).roadmapTopic.findMany({ where: { roadmapId: { in: own.map((i: any) => i.id) } }, include: { topic: true }, orderBy: [{ isPrimary: 'desc' }, { confidence: 'desc' }] }) : [];
  const topicsByOwn: Record<string, Array<{ slug: string; name: string; isPrimary: boolean }>> = {};
  for (const r of ownTopicRows) {
    const arr = (topicsByOwn[r.roadmapId] ||= []);
    if (r.topic) arr.push({ slug: r.topic.slug, name: r.topic.name, isPrimary: !!r.isPrimary });
  }
  const ownWithTopics = own.map((i: any) => ({ ...i, topics: (topicsByOwn[i.id] || []).slice(0, 5) }));
  // Saved from public: join via RoadmapSave -> Roadmap
  const saves = await prisma.roadmapSave.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } });
  const savedIds = saves.map((s: any) => s.roadmapId);
  const savedItemsRaw = savedIds.length ? await prisma.roadmap.findMany({ where: { id: { in: savedIds } }, select: { id: true, title: true, slug: true, updatedAt: true, user: { select: { name: true, image: true } } } }) : [];
  // Attach topics to saved items
  const savedTopicRows = savedItemsRaw.length ? await (prisma as any).roadmapTopic.findMany({ where: { roadmapId: { in: savedItemsRaw.map((i: any) => i.id) } }, include: { topic: true }, orderBy: [{ isPrimary: 'desc' }, { confidence: 'desc' }] }) : [];
  const topicsBySaved: Record<string, Array<{ slug: string; name: string; isPrimary: boolean }>> = {};
  for (const r of savedTopicRows) {
    const arr = (topicsBySaved[r.roadmapId] ||= []);
    if (r.topic) arr.push({ slug: r.topic.slug, name: r.topic.name, isPrimary: !!r.isPrimary });
  }
  const savedWithTopics = savedItemsRaw.map((i: any) => ({ ...i, topics: (topicsBySaved[i.id] || []).slice(0, 5) }));
  const saveOrder = Object.fromEntries(savedIds.map((id, idx) => [id, idx]));
  const savedItems = savedWithTopics.sort((a: any, b: any) => (saveOrder[a.id] ?? 0) - (saveOrder[b.id] ?? 0));

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-black">
      <header className="p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Roadmap Saya</h1>
          <RoadmapSortSelect current={typeof sp?.sort === 'string' ? (sp?.sort as string) : 'updated_desc'} />
        </div>
      </header>
  <div className="p-8">
        {own.length + savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Belum Ada Roadmap</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Mulai dari membuat roadmap baru.</p>
            <Link href="/dashboard/new" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">Buat Rencana Baru</Link>
          </div>
        ) : (
          <div className="space-y-10">
            {own.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dibuat oleh Saya</h2>
                  <div className="text-sm text-slate-500">{own.length} item</div>
                </div>
                <RoadmapGridClient items={ownWithTopics as any} />
              </section>
            )}
            {savedItems.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Disimpan dari Luar</h2>
                  <div className="text-sm text-slate-500">{savedItems.length} item</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedItems.map((i: any) => (
                    <RoadmapCard key={i.id} item={i} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
