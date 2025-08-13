// app/r/[slug]/page.tsx
import { PrismaClient } from '@prisma/client';
import SaveRoadmapButton from '@/components/SaveRoadmapButton';

const prisma = new PrismaClient();

export default async function PublicRoadmapPage({ params }: { params: { slug: string } }) {
  const roadmap = await (prisma as any).roadmap.findFirst({ where: { slug: params.slug, published: true }, include: { user: { select: { name: true } } } });
  if (!roadmap) return <div className="p-8">Tidak ditemukan.</div>;
  const content = roadmap.content as any;
  return (
    <div className="h-full overflow-y-auto bg-white">
      <header className="p-8 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-bold text-slate-900">{roadmap.title}</h1>
        <div className="mt-1 text-slate-500">oleh {roadmap.user?.name || 'Pengguna'}</div>
        <div className="mt-4">
          <SaveRoadmapButton roadmapId={roadmap.id} />
        </div>
      </header>
      <div className="p-8">
        <div className="text-slate-700">
          <div className="text-sm uppercase tracking-wider text-slate-500">Durasi</div>
          <div className="font-semibold">{content?.duration || '-'}</div>
        </div>
        <ol className="mt-6 space-y-4">
          {content?.milestones?.map((m: any, idx: number) => (
            <li key={idx} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold tracking-widest uppercase text-blue-600">{m.timeframe || `Tahap ${idx + 1}`}</div>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{m.topic}</h3>
              {m.sub_tasks?.length ? (
                <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 marker:text-slate-400">
                  {m.sub_tasks.map((task: string, ti: number) => (
                    <li key={ti} className="leading-relaxed">{task}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
