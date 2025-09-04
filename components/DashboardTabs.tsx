"use client";
import { useState } from 'react';
import RoadmapCard from './RoadmapCard';
import { Flame } from 'lucide-react';

type Item = { id: string; title: string; slug: string; avgStars?: number; ratingsCount?: number; verified?: boolean };

export default function DashboardTabs({ forYou, popular }: { forYou: Item[]; popular: Item[] }) {
  const [tab, setTab] = useState<'forYou' | 'popular'>('popular');

  return (
    <div>
      {/* Tabs header */}
    <div className="mt-6 flex items-center gap-6 border-b border-slate-200">
        <button
          className={`-mb-px pb-3 text-sm inline-flex items-center gap-2 border-b-2 ${tab === 'popular' ? 'border-slate-900 font-semibold text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setTab('popular')}
          aria-current={tab === 'popular' ? 'page' : undefined}
        >
          <Flame className="h-4 w-4" /> Popular
        </button>
        <button
          className={`-mb-px pb-3 text-sm font-semibold inline-flex items-center gap-2 border-b-2 ${tab === 'forYou' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setTab('forYou')}
          aria-current={tab === 'forYou' ? 'page' : undefined}
        >
          For You
        </button>
      </div>

      {/* Panels: keep both mounted to maintain a stable children set */}
      <div className="mt-4 space-y-3" key="popular-panel" hidden={tab !== 'popular'}>
        {popular.length === 0 ? (
          <div className="text-sm text-slate-500">Belum ada konten populer.</div>
        ) : (
          popular.map((i: any) => <RoadmapCard key={`popular-${i.id}`} item={i} />)
        )}
      </div>
      <div className="mt-4 space-y-3" key="forYou-panel" hidden={tab !== 'forYou'}>
        {forYou.length === 0 ? (
          <div className="text-sm text-slate-500">Belum ada rekomendasi personal. Mulai buat atau pelajari roadmap untuk melihat rekomendasi.</div>
        ) : (
          forYou.map((i: any) => <RoadmapCard key={`foryou-${i.id}`} item={i} />)
        )}
      </div>
    </div>
  );
}
