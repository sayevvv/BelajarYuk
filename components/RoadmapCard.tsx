"use client";
import Link from 'next/link';

type Item = {
  id: string;
  title: string;
  slug?: string | null;
  durationWeeks?: number | null;
  avgStars?: number | null;
  ratingsCount?: number | null;
  verified?: boolean;
};

export default function RoadmapCard({ item }: { item: Item }) {
  const stars = Math.max(0, Math.min(5, item.avgStars ?? 0));
  const displayStars = stars.toFixed(2).replace(/\.00$/, '.0');
  const weeks = item.durationWeeks ?? null;
  const href = item.slug ? `/r/${item.slug}` : `/dashboard/roadmaps/${item.id}`;
  return (
    <Link href={href} className="block rounded-2xl border border-slate-200 hover:border-blue-300 transition-all bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 truncate">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-500 truncate">Deskripsi Singkat</p>
        </div>
        {item.verified ? (
          <span className="ml-3 inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 border border-blue-200">Verified</span>
        ) : null}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
        {weeks !== null ? (
          <span className="inline-flex items-center gap-1">
            <span aria-hidden className="i-lucide-calendar size-4" />
            {weeks} minggu
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <span aria-hidden className="i-lucide-star size-4" />
          {displayStars}{item.ratingsCount ? <span className="text-slate-400">&nbsp;({item.ratingsCount})</span> : null}
        </span>
      </div>
    </Link>
  );
}
