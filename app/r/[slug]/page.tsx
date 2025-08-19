// app/r/[slug]/page.tsx
import SaveRoadmapButton from '@/components/SaveRoadmapButton';

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

async function getData(slug: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/roadmaps/${slug}`, {
    next: { tags: [`public-roadmap:${slug}`] },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicRoadmapPage(props: any) {
  const { params } = (props || {}) as { params: { slug: string } };
  const roadmap = await getData(params.slug);
  if (!roadmap) return <div className="p-8">Tidak ditemukan.</div>;
  const content = (roadmap as any).content as any;
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-black">
      <header className="p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{(roadmap as any).title}</h1>
        <div className="mt-1 text-slate-500 dark:text-slate-400">oleh {(roadmap as any).user?.name || 'Pengguna'}</div>
        <div className="mt-4">
          <SaveRoadmapButton roadmapId={(roadmap as any).id} />
        </div>
      </header>
      <div className="p-8">
        <div className="text-slate-700 dark:text-slate-300">
          <div className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Durasi</div>
          <div className="font-semibold dark:text-slate-100">{content?.duration || '-'}</div>
        </div>
        <ol className="mt-6 space-y-4">
          {content?.milestones?.map((m: any, idx: number) => (
            <li key={idx} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs font-semibold tracking-widest uppercase text-blue-600">{m.timeframe || `Tahap ${idx + 1}`}</div>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{m.topic}</h3>
              {m.sub_tasks?.length ? (
                <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 marker:text-slate-400">
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
