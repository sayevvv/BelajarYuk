"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import RoadmapGraph from './RoadmapGraph';
import { LayoutList, GitBranch, CheckCircle } from 'lucide-react';

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
  // Start-date disabled for saved roadmaps

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

  // Support both new 'subbab' and legacy 'sub_tasks'
  const milestones: Array<{ timeframe: string; topic: string; subbab?: string[]; sub_tasks?: Array<string | { task: string; type?: string }> }>
    = useMemo(() => (roadmap?.content?.milestones || []) as any, [roadmap]);

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
          <Link href={`/dashboard/roadmaps/${roadmap.id}/read`} className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-semibold hover:bg-blue-700">Mulai Belajar</Link>
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
  {/* Removed start-date controls */}
      </div>

      {/* Main Content */}
      {view === 'graph' ? (
        <div className="flex-1 min-h-0">
          <div className="h-full">
            <RoadmapGraph
              data={{ milestones: milestones as any }}
              onNodeClick={(m: any) => {
                const first = Array.isArray((m as any).subbab) && (m as any).subbab.length > 0
                  ? (m as any).subbab[0]
                  : (Array.isArray((m as any).sub_tasks) && (m as any).sub_tasks.length > 0
                    ? (typeof (m as any).sub_tasks[0] === 'string' ? (m as any).sub_tasks[0] : (m as any).sub_tasks[0]?.task)
                    : undefined);
                show({ type: 'info', title: m.topic, message: first || m.timeframe });
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
                  {(() => {
                    const prevQuizKey = `quiz-m-${mi - 1}`;
                    const prevPassed = mi === 0 ? true : !!(progress?.completedTasks as any)?.[prevQuizKey]?.passed;
                    const href = `/dashboard/roadmaps/${(roadmap as any).id}/read?m=${mi}&s=0`;
                    return prevPassed ? (
                      <Link href={href} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Mulai Belajar</Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-200 text-slate-500 text-xs font-semibold cursor-not-allowed" title="Selesaikan kuis tahap sebelumnya untuk membuka materi ini">Mulai Belajar</span>
                    );
                  })()}
                </div>
                {(Array.isArray((m as any).subbab) && (m as any).subbab.length) || (Array.isArray((m as any).sub_tasks) && (m as any).sub_tasks.length) ? (
                  <ul className="divide-y divide-slate-200 dark:divide-[#1f1f1f]">
                    {(Array.isArray((m as any).subbab) ? (m as any).subbab : (m as any).sub_tasks).map((task: any, ti: number) => {
                      const key = `m-${mi}-t-${ti}`;
                      const done = !!progress?.completedTasks?.[key];
                      const label = typeof task === 'string' ? task : task?.task;
                      return (
                        <li key={ti} className="flex items-center gap-3 px-5 py-3">
                          {done ? (
                            <CheckCircle className="h-5 w-5 text-green-600" aria-label="Selesai" />
                          ) : (
                            <span className="h-5 w-5 inline-block rounded-full border border-slate-300" aria-hidden />
                          )}
                          <Link href={`/dashboard/roadmaps/${(roadmap as any).id}/read?m=${mi}&s=${ti}`} className="text-slate-800 dark:text-neutral-200 hover:underline">{label}</Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {/* Quiz row with distinct background */}
                <div className="px-5 py-3 border-t border-slate-200 dark:border-[#1f1f1f] bg-sky-50 dark:bg-[#0b1a24] rounded-b-xl">
                  {(() => {
                    const quizKey = `quiz-m-${mi}`;
                    const quizEntry: any = (progress?.completedTasks as any)?.[quizKey];
                    const quizDone = !!quizEntry?.passed;
                    const quizScore = typeof quizEntry?.score === 'number' ? quizEntry.score : null;
                    return (
                      <Link href={`/dashboard/roadmaps/${(roadmap as any).id}/quiz?m=${mi}`} className="flex items-center gap-3 text-sky-900 dark:text-sky-300 hover:underline font-medium">
                        {quizDone ? (
                          <CheckCircle className="h-5 w-5 text-green-600" aria-label="Kuis Lulus" />
                        ) : (
                          <span className="h-5 w-5 inline-block rounded-full border border-slate-300" aria-hidden />
                        )}
                        <span>Kuis {m.topic}{quizScore !== null ? ` — Skor: ${quizScore}%` : ''}</span>
                      </Link>
                    );
                  })()}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
