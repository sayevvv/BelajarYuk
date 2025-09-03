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
  user?: { name?: string | null; image?: string | null } | null;
  topics?: Array<{ slug: string; name: string; isPrimary?: boolean }>;
};

export default function RoadmapCard({ item }: { item: Item }) {
  const stars = Math.max(0, Math.min(5, item.avgStars ?? 0));
  const displayStars = stars.toFixed(2).replace(/\.00$/, '.0');
  const weeks = item.durationWeeks ?? null;
  const href = item.slug ? `/r/${item.slug}` : `/dashboard/roadmaps/${item.id}`;
  const authorName = item.user?.name ?? null;
  const authorImage = item.user?.image ?? null;
  return (
    <Link href={href} className="block rounded-2xl border border-slate-200 hover:border-blue-300 transition-all bg-white dark:bg-[#0b0b0b] p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 truncate">{item.title}</h3>
    {authorName ? (
            <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[12px] text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-200">
              <span className="inline-flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[10px] text-slate-600">
                {authorImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={authorImage} alt={authorName} className="h-full w-full object-cover" />
                ) : (
      <UserIcon className="h-3.5 w-3.5" />
                )}
              </span>
              <span className="truncate">oleh {authorName}</span>
            </div>
          ) : null}
          {Array.isArray(item.topics) && item.topics.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.topics.slice(0, 3).map((t) => (
                <span
                  key={`${item.id}:${t.slug}`}
                  className={`px-2 py-0.5 text-[11px] rounded-full border ${t.isPrimary ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  title={t.isPrimary ? 'Topik Utama' : 'Topik'}
                >
                  {t.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {item.verified ? (
          <span className="ml-3 inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 border border-blue-200">Verified</span>
        ) : null}
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
        {weeks !== null ? (
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            {weeks} minggu
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <span className="text-yellow-500" aria-hidden>★</span>
          {displayStars}{item.ratingsCount ? <span className="text-slate-400">&nbsp;({item.ratingsCount})</span> : null}
        </span>
      </div>
    </Link>
  );
}

function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 6.75h15a1.5 1.5 0 011.5 1.5V18a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18V8.25a1.5 1.5 0 011.5-1.5z" />
    </svg>
  );
}

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12zm0 2c-4.418 0-8 3.134-8 7v1h16v-1c0-3.866-3.582-7-8-7z" />
    </svg>
  );
}
