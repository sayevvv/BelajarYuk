"use client";
import { useEffect, useState } from 'react';

type Aggregate = {
  avg: number;
  count: number;
  histogram: number[];
  saves: number;
  forks: number;
};

export default function RatingSummary({ roadmapId, canRate }: { roadmapId: string; canRate: boolean }) {
  const [agg, setAgg] = useState<Aggregate | null>(null);
  const [my, setMy] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const d = await fetch(`/api/roadmaps/${roadmapId}/rating`, { cache: 'no-store' }).then(r => r.json());
    setAgg(d?.aggregate || { avg: 0, count: 0, histogram: [0,0,0,0,0], saves: 0, forks: 0 });
    setMy(d?.myRating?.stars ?? null);
  }

  useEffect(() => { load(); }, [roadmapId]);

  async function rate(stars: number) {
    if (!canRate || busy) return;
    setBusy(true);
    const res = await fetch(`/api/roadmaps/${roadmapId}/rating`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stars }) });
    setBusy(false);
    if (res.ok) load();
  }

  const avg = agg?.avg ?? 0;
  const count = agg?.count ?? 0;
  const saves = agg?.saves ?? 0;
  const forks = agg?.forks ?? 0;
  const display = my ?? Math.round(avg);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1,2,3,4,5].map(i => (
            <button key={i} aria-label={`beri ${i} bintang`} disabled={!canRate}
              onClick={() => rate(i)}
              className={`p-0.5 text-lg ${i <= display ? 'text-yellow-500' : 'text-slate-300'} ${canRate ? 'hover:scale-110' : ''}`}>
              ★
            </button>
          ))}
        </div>
        <span className="text-sm text-slate-600">{avg.toFixed(1)} ({count})</span>
      </div>
      {/* Show saves/forks only for public roadmaps (server GET returns 0 for non-public) */}
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span title="Disimpan">💾 {saves}</span>
        <span title="Fork">🍴 {forks}</span>
      </div>
    </div>
  );
}
