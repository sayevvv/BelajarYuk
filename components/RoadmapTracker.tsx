"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import RoadmapGraph from './RoadmapGraph';
import { LayoutList, GitBranch } from 'lucide-react';

type Roadmap = {
  id: string;
  title: string;
  content: any;
  published?: boolean;
  slug?: string | null;
  sourceId?: string | null;
};

export default function RoadmapTracker({ roadmapId }: { roadmapId: string }) {
  const router = useRouter();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<{ completedTasks: Record<string, boolean>; percent: number } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [view, setView] = useState<'graph' | 'checklist'>('graph');

  // Load roadmap + progress
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const [r, p] = await Promise.all([
          fetch(`/api/roadmaps/${roadmapId}`),
          fetch(`/api/roadmaps/${roadmapId}/progress`),
        ]);
        if (!r.ok) throw new Error('Gagal memuat roadmap');
        const rj = await r.json();
        const pj = p.ok ? await p.json() : null;
        if (!active) return;
        setRoadmap(rj);
        setProgress(pj || { completedTasks: {}, percent: 0 });
      } catch (e: any) {
        if (!active) return;
        setError(e.message || 'Gagal memuat data');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [roadmapId]);

  // Restore preferred view per roadmap, default to graph
  useEffect(() => {
    try {
      const key = `roadmapView:${roadmapId}`;
      const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (saved === 'checklist' || saved === 'graph') setView(saved);
      else setView('graph');
    } catch {}
  }, [roadmapId]);

  // Persist view choice
  useEffect(() => {
    try {
      const key = `roadmapView:${roadmapId}`;
      if (typeof window !== 'undefined') localStorage.setItem(key, view);
    } catch {}
  }, [view, roadmapId]);

  const milestones: Array<{ timeframe: string; topic: string; sub_tasks: string[] }>
    = useMemo(() => roadmap?.content?.milestones || [], [roadmap]);

  const toggleTask = async (mi: number, ti: number, done: boolean) => {
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneIndex: mi, taskIndex: ti, done }),
      });
      if (!res.ok) throw new Error('Gagal menyimpan progress');
      const pj = await res.json();
      setProgress(pj);
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan progress');
    }
  };

  const handlePublish = async (publish: boolean) => {
    try {
      setPublishing(true);
      const res = await fetch(`/api/roadmaps/${roadmapId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui publikasi');
      const rj = await res.json();
      setRoadmap((prev) => ({ ...(prev as any), ...rj }));
    } catch (e: any) {
  setError(e.message || 'Gagal memperbarui publikasi');
  show({ type: 'error', title: 'Gagal', message: e.message || 'Gagal memperbarui publikasi' });
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus roadmap ini? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus roadmap');
      show({ type: 'success', title: 'Dihapus', message: 'Roadmap berhasil dihapus.' });
      router.push('/dashboard/history');
    } catch (e: any) {
      setError(e.message || 'Gagal menghapus roadmap');
      show({ type: 'error', title: 'Gagal', message: e.message || 'Gagal menghapus roadmap' });
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center">Memuat...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-700 bg-red-50">{error}</div>;
  }
  if (!roadmap) {
    return <div className="p-6">Roadmap tidak ditemukan.</div>;
  }

  return (
    <div className="h-full overflow-hidden bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 p-6 border-b border-slate-200 dark:border-[#1f1f1f] sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500">Rencana Belajar</div>
          <h1 className="text-2xl font-bold text-slate-900">{roadmap.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] overflow-hidden">
            <button
              type="button"
              onClick={() => setView('graph')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm ${view === 'graph' ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300'}`}
              title="Lihat Graph"
            >
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">Graph</span>
            </button>
            <button
              type="button"
              onClick={() => setView('checklist')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm ${view === 'checklist' ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300'}`}
              title="Lihat Checklist"
            >
              <LayoutList className="h-4 w-4" />
              <span className="hidden sm:inline">Checklist</span>
            </button>
          </div>
          {roadmap.published && roadmap.slug ? (
            <Link href={`/r/${roadmap.slug}`} className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-semibold hover:bg-slate-800" target="_blank">Lihat Publik</Link>
          ) : null}
          <button
            type="button"
            disabled={publishing || !!(roadmap as any).sourceId}
            onClick={() => handlePublish(!(roadmap as any).published)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${ (roadmap as any).published ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {(roadmap as any).sourceId ? 'Tidak dapat dipublikasi (hasil simpan)' : ((roadmap as any).published ? 'Batalkan Publikasi' : 'Publikasikan')}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg px-3 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="p-6 border-b border-slate-200 dark:border-[#1f1f1f]">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span className="font-semibold">{progress?.percent ?? 0}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress?.percent ?? 0}%` }} />
        </div>
      </div>

      {/* Main Content */}
      {view === 'graph' ? (
        <div className="flex-1 min-h-0">
          <div className="h-full">
            <RoadmapGraph
              data={{ milestones: milestones as any }}
              onNodeClick={(m: any) => {
                show({ type: 'info', title: m.topic, message: m.sub_tasks?.[0] || m.timeframe });
              }}
              promptMode={'simple'}
              showMiniMap={false}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <ol className="space-y-4">
            {milestones.map((m, mi) => (
              <li key={mi} className="rounded-xl border border-slate-200 bg-white dark:border-[#1f1f1f] dark:bg-[#0a0a0a]">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-[#1f1f1f] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold tracking-widest uppercase text-blue-600">{m.timeframe || `Tahap ${mi + 1}`}</div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-neutral-100">{m.topic}</h3>
                  </div>
                </div>
                {m.sub_tasks?.length ? (
                  <ul className="divide-y divide-slate-200 dark:divide-[#1f1f1f]">
                    {m.sub_tasks.map((task, ti) => {
                      const key = `m-${mi}-t-${ti}`;
                      const done = !!progress?.completedTasks?.[key];
                      return (
                        <li key={ti} className="flex items-center gap-3 px-5 py-3">
                          <input
                            id={`${key}`}
                            type="checkbox"
                            checked={done}
                            onChange={(e) => toggleTask(mi, ti, e.target.checked)}
                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`${key}`} className={`text-slate-800 dark:text-neutral-200 ${done ? 'line-through text-slate-400 dark:text-neutral-500' : ''}`}>{task}</label>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
