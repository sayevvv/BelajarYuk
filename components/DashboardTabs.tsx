"use client";
import { useState } from 'react';
import RoadmapCard from './RoadmapCard';

type Item = { id: string; title: string; slug: string; avgStars?: number; ratingsCount?: number };

export default function DashboardTabs({ forYou, popular }: { forYou: Item[]; popular: Item[] }) {
  const [tab, setTab] = useState<'forYou' | 'popular'>('forYou');

  return (
    <div>
      {/* Tabs header */}
    <div className="mt-6 flex items-center gap-6 border-b border-slate-200">
        <button
      className={`-mb-px pb-3 text-sm font-semibold inline-flex items-center gap-2 border-b-2 ${tab === 'forYou' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setTab('forYou')}
          aria-current={tab === 'forYou' ? 'page' : undefined}
        >
          For You
        </button>
        <button
      className={`-mb-px pb-3 text-sm inline-flex items-center gap-2 border-b-2 ${tab === 'popular' ? 'border-slate-900 font-semibold text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          onClick={() => setTab('popular')}
          aria-current={tab === 'popular' ? 'page' : undefined}
        >
          Popular
        </button>
      </div>

      {/* Lists */}
      {tab === 'forYou' ? (
        <div className="mt-4 space-y-3">
          {forYou.length === 0 ? (
            <div className="text-sm text-slate-500">Belum ada rekomendasi personal. Mulai buat atau pelajari roadmap untuk melihat rekomendasi.</div>
          ) : (
            forYou.map((i: any) => <RoadmapCard key={i.id} item={i} />)
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {popular.length === 0 ? (
            <div className="text-sm text-slate-500">Belum ada konten populer.</div>
          ) : (
            popular.map((i: any) => <RoadmapCard key={i.id} item={i} />)
          )}
        </div>
      )}
    </div>
  );
}
