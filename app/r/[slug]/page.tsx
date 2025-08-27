// app/r/[slug]/page.tsx
import SaveRoadmapButton from '@/components/SaveRoadmapButton';
import RoadmapGraph from '@/components/RoadmapGraph';
import { Suspense } from 'react';

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
      <ClientPublicRoadmap content={content} />
    </div>
  );
}

"use client";
import { useState } from 'react';

function ClientPublicRoadmap({ content }: { content: any }) {
  const [startDate, setStartDate] = useState<string>('');
  return (
    <div className="p-8">
      <div className="text-slate-700 dark:text-slate-300">
        <div className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Durasi</div>
        <div className="font-semibold dark:text-slate-100">{content?.duration || '-'}</div>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <div>
          <label htmlFor="startDatePublic" className="block text-xs font-medium text-slate-600 dark:text-slate-300">Mulai dari Tanggal</label>
          <input id="startDatePublic" type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="mt-1 w-52 px-3 py-1.5 text-sm border rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100" />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Tanggal di setiap milestone akan menyesuaikan.</div>
      </div>
      <div className="mt-6 h-[70vh] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <RoadmapGraph data={{ milestones: content?.milestones || [] }} onNodeClick={()=>{}} promptMode={'advanced'} startDate={startDate || undefined} />
      </div>
    </div>
  );
}
