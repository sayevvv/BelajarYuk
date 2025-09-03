"use client";

import Link from 'next/link';
import React from 'react';

type RoadmapItem = {
  id: string;
  title: string;
  updatedAt: string | Date;
  content?: any;
};

export default function RoadmapGridClient({ items }: { items: RoadmapItem[] }) {
  const [preparingId, setPreparingId] = React.useState<string | null>(null);
  const [readyMap, setReadyMap] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const created = url.searchParams.get('created');
    if (created) {
      setPreparingId(created);
      (async () => {
        try {
          await fetch(`/api/roadmaps/${created}/prepare-materials`, { method: 'POST' });
        } catch {}
        setReadyMap((m) => ({ ...m, [created]: true }));
        url.searchParams.delete('created');
        window.history.replaceState({}, '', url.toString());
      })();
    }
  }, []);

  const isReady = (id: string) => readyMap[id] || id !== preparingId;
  const isGenerating = (r: RoadmapItem) => {
    try {
      const gen = (r as any)?.content?._generation || {};
      if (!gen?.inProgress) return false;
      const started = Date.parse(gen?.startedAt || '');
      if (!started || Number.isNaN(started)) return true;
      // consider active if within 45 minutes since start
      return (Date.now() - started) < 45 * 60 * 1000;
    } catch {
      return false;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((r) => {
  const gated = !isReady(r.id) || isGenerating(r);
        const updated = new Date(r.updatedAt);
        return (
          <div key={r.id} className={`relative bg-slate-50 p-6 rounded-xl border border-slate-200 transition-all dark:bg-slate-900 dark:border-slate-800 hover:shadow-md hover:border-blue-300 dark:hover:border-slate-700`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-slate-800 text-lg truncate dark:text-slate-100">{r.title}</h3>
              {gated ? (
                <div className="flex items-center gap-2 text-xs text-slate-500"><span className="inline-block h-2 w-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /> Menyiapkan materi…</div>
              ) : null}
            </div>
            <div className="text-sm text-slate-500 mt-2 dark:text-slate-400">Diperbarui {updated.toLocaleString('id-ID')}</div>
            <Link href={`/dashboard/roadmaps/${r.id}?from=roadmaps`} className="mt-4 inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">Buka</Link>
          </div>
        );
      })}
    </div>
  );
}
