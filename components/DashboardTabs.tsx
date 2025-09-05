"use client";
import RoadmapCard from './RoadmapCard';
import { Flame } from 'lucide-react';

type Item = { id: string; title: string; slug: string; avgStars?: number; ratingsCount?: number; verified?: boolean };

export default function DashboardTabs({ forYou, popular }: { forYou: Item[]; popular: Item[] }) {
  return (
    <div>
      {/* Popular section */}
      <div className="mt-6 flex items-center gap-2">
        <Flame className="h-4 w-4 text-slate-900" />
        <h3 className="text-sm font-semibold text-slate-900">Popular</h3>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr" key="popular-panel">
        {popular.length === 0 ? (
          <div className="text-sm text-slate-500">Belum ada konten populer.</div>
        ) : (
          popular.map((i: any) => (
            <div key={`popular-${i.id}`} className="h-full">
              <RoadmapCard item={i} bottomMetaAlign />
            </div>
          ))
        )}
      </div>

      {/* For You section */}
      <div className="mt-8 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-900">For You</h3>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr" key="forYou-panel">
        {forYou.length === 0 ? (
          <div className="text-sm text-slate-500">Belum ada rekomendasi personal. Mulai buat atau pelajari roadmap untuk melihat rekomendasi.</div>
        ) : (
          forYou.map((i: any) => (
            <div key={`foryou-${i.id}`} className="h-full">
              <RoadmapCard item={i} bottomMetaAlign />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
