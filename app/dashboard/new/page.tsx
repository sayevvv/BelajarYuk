// app/dashboard/new/page.tsx

"use client";

import { useState, useEffect, useRef, FormEvent, Fragment } from "react";
import { useToast } from '@/components/ui/ToastProvider';
import { z } from "zod";
import RoadmapGraph from "@/components/RoadmapGraph";
import MindmapGraph from "@/components/MindmapGraph";
import RoadmapPlaceholder from "@/components/RoadmapPlaceholder"; // Impor komponen baru
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { cn } from '@/lib/utils';
import { GitBranch, LayoutList, BookOpen, Hammer, Dumbbell, FilePlus2 } from 'lucide-react';

// --- Skema Zod ---
const roadmapSchema = z.object({
  duration: z.string(),
  milestones: z.array(
    z.object({
      timeframe: z.string(),
      topic: z.string(),
  subbab: z.array(z.string()),
      estimated_dates: z.string().optional(),
      daily_duration: z.string().optional(),
    })
  ),
});
type RoadmapData = z.infer<typeof roadmapSchema>;

const mindmapSchema = z.object({
  topic: z.string(),
  subtopics: z.array(
    z.object({
      id: z.number(),
      topic: z.string(),
      details: z.string(),
      dependencies: z.array(z.number()),
    })
  ),
});
type MindmapData = z.infer<typeof mindmapSchema>;

const explanationSchema = z.object({
  explanation: z.string(),
});

type Milestone = RoadmapData["milestones"][0];

// Chat UI components
const ChatBubble = ({ role, content }: { role: 'user'|'assistant'; content: string }) => {
  const isUser = role === 'user';
  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap shadow-sm',
        isUser ? 'bg-blue-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'
      )}>
        {content}
      </div>
    </div>
  );
};

const TypingBubble = () => (
  <div className="flex justify-start">
    <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md px-3 py-2 text-sm shadow-sm">
      <span className="inline-flex gap-1">
        <span className="size-1.5 rounded-full bg-slate-500 animate-pulse" />
        <span className="size-1.5 rounded-full bg-slate-500 animate-pulse [animation-delay:120ms]" />
        <span className="size-1.5 rounded-full bg-slate-500 animate-pulse [animation-delay:240ms]" />
      </span>
    </div>
  </div>
);

// --- Komponen Modal ---
const MindmapModal = ({ mindmapData, explanation, resources, isLoading, onClose, topic }: { 
  mindmapData: MindmapData | null, 
  explanation: string | null,
  resources: Array<{ title: string; url: string; source: string }> | null,
  isLoading: boolean, 
  onClose: () => void, 
  topic: string 
}) => (
    <Transition as={Fragment} show={true} appear>
  <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm" /></Transition.Child><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden"><header className="flex items-center justify-between flex-shrink-0 p-4 border-b border-slate-200"><h2 className="text-lg font-semibold text-slate-900" id="modal-title">Jabaran Materi: <span className="font-bold text-blue-600">{topic}</span></h2><button onClick={onClose} className="p-1 transition-colors rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100" aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></header><div className="flex flex-grow overflow-hidden"><aside className="w-1/3 p-6 overflow-y-auto border-r border-slate-200 bg-slate-50/50"><h3 className="font-semibold text-slate-800">Penjelasan Lengkap</h3>{isLoading || !explanation ? (<div className="space-y-4 mt-2"><div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div><div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div><div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div><div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div></div>) : (<><p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-slate-600">{explanation}</p>{resources?.length ? (<div className="mt-6"><h4 className="text-sm font-semibold text-slate-700">Sumber Belajar Rekomendasi</h4><ul className="mt-2 space-y-2 text-sm">{resources.map((r, i) => (<li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{r.title}</a><span className="ml-2 text-xs text-slate-500">({r.source})</span></li>))}</ul></div>) : null}</>)}
  </aside><main className="relative flex-grow w-2/3">{isLoading ? (<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50"><span className="font-medium text-slate-600">Membangun mindmap...</span></div>) : (mindmapData ? <MindmapGraph data={mindmapData} /> : <div className="flex items-center justify-center h-full text-slate-400">Mindmap akan muncul di sini.</div>)}</main></div></div></Transition.Child></div>
    </Transition>
);

// --- Komponen Halaman Buat Roadmap Baru ---
export default function NewRoadmapPage() {
  const { data: session, status } = useSession();
  const { show } = useToast();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [resources, setResources] = useState<Array<{ title: string; url: string; source: string }> | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [promptMode, setPromptMode] = useState<'simple' | 'advanced'>('simple');
  const [topic, setTopic] = useState("");
  const [simpleDetails, setSimpleDetails] = useState("");
  const [availableDays, setAvailableDays] = useState('all');
  const [dailyDuration, setDailyDuration] = useState(2);
  const [finalGoal, setFinalGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'pro'>('beginner');
  const [enableTimeOptions, setEnableTimeOptions] = useState(false);
  const [showTextView, setShowTextView] = useState(false);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  // Snapshot of the topic used to generate the currently loaded roadmap (for stable display)
  const [activeTopic, setActiveTopic] = useState('');
  // Snapshot of the prompt mode used to generate the current roadmap (stabilize timestamps display)
  const [activePromptMode, setActivePromptMode] = useState<'simple' | 'advanced'>('simple');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // Chat-like AI edit state (now lives in the left panel after roadmap exists)
  const [chatMessages, setChatMessages] = useState<{ role: 'user'|'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [useAdvancedContext, setUseAdvancedContext] = useState(false);
  const [listKey, setListKey] = useState(0);
  const [newFormOpen, setNewFormOpen] = useState(false);

  const isSessionLoading = status === "loading";

  const handleNodeClick = async (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsModalLoading(true);
    setMindmapData(null);
  setExplanation(null);
  setResources(null);
    setError(null);
  const detailsForApi = Array.isArray((milestone as any).subbab) ? (milestone as any).subbab.join('\n- ') : '';
    try {
      const [mindmapResponse, explanationResponse, resourcesResponse] = await Promise.all([
        fetch('/api/generate-mindmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: milestone.topic, details: detailsForApi }), }),
        fetch('/api/generate-explanation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: milestone.topic, details: detailsForApi }), }),
        fetch('/api/get-resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: milestone.topic }) })
      ]);
      if (!mindmapResponse.ok || !explanationResponse.ok || !resourcesResponse.ok) throw new Error(`Server error`);
      const mindmapResult = await mindmapResponse.json();
      const parsedMindmap = mindmapSchema.safeParse(mindmapResult);
      if (parsedMindmap.success) setMindmapData(parsedMindmap.data); else console.error("Zod validation error for mindmap:", parsedMindmap.error);
      const explanationResult = await explanationResponse.json();
      const parsedExplanation = explanationSchema.safeParse(explanationResult);
      if (parsedExplanation.success) setExplanation(parsedExplanation.data.explanation); else console.error("Zod validation error for explanation:", parsedExplanation.error);
      const resourcesResult = await resourcesResponse.json();
      if (Array.isArray(resourcesResult?.resources)) setResources(resourcesResult.resources);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data detail.");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // If replacing an existing roadmap, run cancel-like reset but without confirmation; show warning toast
    if (roadmapData) {
      try { show({ type: 'info', title: 'Mengganti Roadmap', message: 'Roadmap sebelumnya dibuang. Membuat yang baru…' }); } catch {}
      setChatMessages([]);
      setChatInput('');
      setChatLoading(false);
      setSelectedMilestone(null);
      setMindmapData(null);
      setExplanation(null);
      setResources(null);
      setIsModalLoading(false);
      setShowTextView(false);
      setRoadmapTitle('');
      setNewFormOpen(false);
    }
    setIsLoading(true);
    setError(null);
    setRoadmapData(null);
  setIsSaved(false);
    const topicToSend = (promptMode === 'simple' ? simpleDetails : topic).trim();
    const details = (promptMode === 'advanced')
      ? (() => {
          const levelLabel = userLevel === 'beginner'
            ? 'Baru mulai dari nol'
            : userLevel === 'intermediate'
              ? `Sudah paham dasar-dasar ${topic || 'topik ini'}`
              : 'Profesional yang ingin menambah skill';
          const parts: string[] = [];
          parts.push(`Level Pengguna: ${levelLabel}.`);
          parts.push(`Tujuan Akhir: ${finalGoal || 'Menguasai topik secara fundamental'}.`);
          if (enableTimeOptions) {
            const dayMapping: { [key: string]: string } = { all: 'Setiap Hari (Kerja & Akhir Pekan)', weekdays: 'Hanya Hari Kerja', weekends: 'Hanya Akhir Pekan' };
            parts.push(`Ketersediaan Waktu: ${dayMapping[availableDays]}.`);
            parts.push(`Durasi Belajar Maksimal: ${dailyDuration} jam per hari.`);
            parts.push(`Periode Belajar: Dari ${startDate || 'sekarang'} sampai ${endDate || 'tidak ditentukan'}.`);
          }
          return parts.join(' ').trim();
        })()
      : '';

    if (!topicToSend) {
      setIsLoading(false);
      setError('Mohon isi deskripsi topik.');
      return;
    }
    if (promptMode === 'simple') {
      // simpan juga ke state topic untuk fallback judul/simpan
      setTopic(topicToSend);
    }
    try {
      const response = await fetch('/api/generate-roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: topicToSend, details, promptMode }), });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      const parsedData = roadmapSchema.safeParse(data);
      if (parsedData.success) {
        setRoadmapData(parsedData.data);
  setIsSaved(false);
        // Snapshot the topic used for this roadmap to keep header stable while drafting a new one
        setActiveTopic(topicToSend);
  // Snapshot the prompt mode used to generate this roadmap so left panel toggles won't affect graph display
  setActivePromptMode(promptMode);
        // Generate title automatically from topic and details
        try {
          const titleRes = await fetch('/api/generate-title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topicToSend, details }),
          });
          if (titleRes.ok) {
            const tdata = await titleRes.json();
            if (tdata?.title) setRoadmapTitle(tdata.title);
          }
  } catch {
          console.warn('Gagal membuat judul otomatis, fallback ke topik.');
        }
      } else { console.error("Validation Error:", parsedData.error); throw new Error("Struktur data dari server tidak valid."); }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoadmap = async () => {
  if (saving) return;
    if (!session) {
  show({ type: 'info', title: 'Perlu Login', message: 'Silakan login untuk menyimpan roadmap Anda.' });
      window.location.href = '/login?callbackUrl=/dashboard/new';
      return;
    }
    if (!roadmapData) {
  show({ type: 'error', title: 'Tidak Bisa Menyimpan', message: 'Tidak ada roadmap untuk disimpan!' });
      return;
    }
    try {
      setSaving(true);
  const response = await fetch('/api/roadmaps/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: roadmapTitle || activeTopic, content: roadmapData, }), });
      if (!response.ok) throw new Error("Gagal menyimpan roadmap.");
      const saved = await response.json();
      show({ type: 'success', title: 'Tersimpan', message: 'Roadmap berhasil disimpan!' });
      setIsSaved(true);
  // Redirect ke daftar "Roadmap Saya" dan jalankan persiapan materi di background
  window.location.href = `/dashboard/roadmaps?created=${saved.id}`;
    } catch (err: any) {
      setError(err.message);
  show({ type: 'error', title: 'Gagal Menyimpan', message: err.message || 'Terjadi kesalahan.' });
    } finally { setSaving(false); }
  };

  // Batalkan pembuatan/penyuntingan roadmap dan reset seluruh state ke awal
  const handleCancel = () => {
    const somethingToLose = !!(
      simpleDetails.trim() || topic.trim() || finalGoal.trim() || startDate || endDate ||
      promptMode === 'advanced' || availableDays !== 'all' || dailyDuration !== 2 ||
      roadmapData
    );
    if (somethingToLose) {
      const ok = window.confirm('Batalkan pembuatan roadmap ini? Semua perubahan akan hilang.');
      if (!ok) return;
    }
    // Reset form inputs
    setPromptMode('simple');
    setSimpleDetails('');
    setTopic('');
    setAvailableDays('all');
    setDailyDuration(2);
    setStartDate('');
    setEndDate('');
    setFinalGoal('');
    setError(null);
    setIsLoading(false);
    setShowTextView(false);
    // Reset generated & chat state
    setRoadmapData(null);
    setRoadmapTitle('');
  setActiveTopic('');
  setActivePromptMode('simple');
    setChatMessages([]);
    setChatInput('');
    setChatLoading(false);
    setUseAdvancedContext(false);
    setListKey((k) => k + 1);
    setSelectedMilestone(null);
    setMindmapData(null);
    setExplanation(null);
  setIsModalLoading(false);
  setResources(null);
    // Mark as saved to silence unsaved guard
    setIsSaved(true);
    try { show({ type: 'info', title: 'Dibatalkan', message: 'Pembuatan roadmap dibatalkan.' }); } catch {}
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!roadmapData || !chatInput.trim()) return;
    const userMsg = { role: 'user' as const, content: chatInput.trim() };
    setChatMessages((m) => [...m, userMsg]);
    setChatLoading(true);
    try {
  const constraints = useAdvancedContext ? { availableDays, dailyDuration, startDate, endDate, finalGoal, userLevel } : undefined;
      const res = await fetch('/api/roadmaps/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current: roadmapData,
          instruction: chatInput.trim(),
          promptMode: useAdvancedContext ? 'advanced' : 'simple',
          constraints,
        }),
      });
      if (!res.ok) throw new Error('Gagal mengedit roadmap');
      const data = await res.json();
      const parsed = roadmapSchema.safeParse(data.updated);
      if (parsed.success) {
        setRoadmapData(parsed.data);
        setIsSaved(false); // any edit makes it unsaved again
        setChatMessages((m) => [...m, { role: 'assistant', content: data.summary || 'Perubahan diterapkan.' }]);
      } else {
        setChatMessages((m) => [...m, { role: 'assistant', content: 'Maaf, perubahan tidak dapat diterapkan (validasi gagal).' }]);
      }
    } catch (err: any) {
      setChatMessages((m) => [...m, { role: 'assistant', content: err.message || 'Terjadi kesalahan.' }]);
    } finally {
      setChatLoading(false);
      setChatInput('');
      setListKey((k) => k + 1);
    }
  };

  // no explicit startNewRoadmap; use icon toggle to open the initial form

  // Unsaved changes guard: beforeunload + internal navigation interception
  const hasUnsaved = !isSaved && !!(
    // inputs typed or options changed
    simpleDetails.trim() || topic.trim() || finalGoal.trim() || startDate || endDate ||
    promptMode === 'advanced' || availableDays !== 'all' || dailyDuration !== 2 ||
    // has roadmap content not saved in this session yet
    roadmapData
  );

  const currentUrlRef = useRef<string>('');
  useEffect(() => {
    currentUrlRef.current = window.location.href;
  }, []);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsaved) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    // Intercept anchor clicks for client-side navigations
    const onDocumentClick = (e: MouseEvent) => {
      if (!hasUnsaved) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return; // allow new tab/window
      const href = anchor.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      // Same-page Link with no real navigation
      const url = new URL(href, window.location.origin);
      const same = url.pathname === window.location.pathname && url.search === window.location.search && url.hash === window.location.hash;
      if (same) return;
      const ok = window.confirm('Perubahan belum disimpan. Tinggalkan halaman? Progress Anda akan hilang.');
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('click', onDocumentClick, true);

    // Handle browser back/forward
  const onPopState = () => {
      if (!hasUnsaved) return;
      const ok = window.confirm('Perubahan belum disimpan. Tinggalkan halaman? Progress Anda akan hilang.');
      if (!ok) {
        // revert to current URL
        history.pushState(null, '', currentUrlRef.current);
      } else {
        // allow: update ref to new URL
        currentUrlRef.current = window.location.href;
      }
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onDocumentClick, true);
      window.removeEventListener('popstate', onPopState);
    };
  }, [hasUnsaved]);

  // Text View component to render roadmap as clickable list
  const RoadmapTextView = ({ data, onClick }: { data: RoadmapData; onClick: (m: Milestone) => void }) => (
    <div className="h-full overflow-y-auto p-6 sm:p-8">
      <ol className="space-y-4">
        {data.milestones.map((m, idx) => (
          <li key={`${idx}-${m.topic}`}>
            <button
              type="button"
              onClick={() => onClick(m)}
              className="w-full text-left group"
            >
              <div className="rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-400 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold tracking-widest uppercase text-blue-600">{m.timeframe || `Tahap ${idx + 1}`}</div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-blue-700">{m.topic}</h3>
                  </div>
                  <div className="flex-shrink-0 text-sm text-slate-500">{m.estimated_dates || ''}</div>
                </div>
                {Array.isArray((m as any).subbab) && (m as any).subbab.length ? (
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {(m as any).subbab.map((title: string, ti: number) => (
                      <li key={ti} className="leading-relaxed list-disc list-inside text-slate-700">{title}</li>
                    ))}
                  </ul>
                ) : null}
                {m.daily_duration && (
                  <div className="mt-3 text-xs text-slate-500">Durasi harian: {m.daily_duration}</div>
                )}
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    isSessionLoading ? (
      <div className="flex h-full items-center justify-center"><p>Loading session...</p></div>
    ) : (
  <div className="flex h-full">
  <div className="w-[400px] bg-white dark:bg-black p-8 flex flex-col flex-shrink-0 border-r border-slate-200 dark:border-slate-800">
        {!roadmapData || newFormOpen ? (
          <>
            <header className={"flex items-center justify-between gap-3"}>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">Buat Roadmap Baru</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 truncate">Isi detail di bawah untuk memulai.</p>
              </div>
              {roadmapData ? (
                <button
                  type="button"
                  onClick={() => setNewFormOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  title="Kembali ke Edit AI"
                >
                  <FilePlus2 className="h-4 w-4" />
                </button>
              ) : null}
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow mt-8">
              {/* Pilih mode prompt */}
              <div className="flex p-1 mb-6 bg-slate-100 rounded-lg">
                <button type="button" onClick={() => setPromptMode('simple')} className={`w-1/2 p-2 text-sm font-semibold rounded-md transition-colors ${promptMode === 'simple' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Simple</button>
                <button type="button" onClick={() => setPromptMode('advanced')} className={`w-1/2 p-2 text-sm font-semibold rounded-md transition-colors ${promptMode === 'advanced' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Advanced</button>
              </div>
              <div className="mt-4 flex-grow overflow-y-auto pr-2">
                {promptMode === 'simple' ? (
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1.5">Apa yang ingin kamu pelajari?</label>
                    <textarea id="prompt" value={simpleDetails} onChange={(e) => setSimpleDetails(e.target.value)} required placeholder="Contoh: Belajar Next.js dari nol untuk bikin portfolio. Waktu luang 1-2 jam per hari." className="w-full h-28 px-3 py-2 transition-colors border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 1. Topik Utama */}
                    <div>
                      <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1.5">Topik Utama</label>
                      <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Contoh: Belajar Next.js dari Dasar" className="w-full px-3 py-2 transition-colors border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
                    </div>
                    {/* 2. Level Pengguna */}
                    <div>
                      <label htmlFor="userLevel" className="block text-sm font-medium text-slate-700 mb-1.5">Level Pengguna</label>
                      <select
                        id="userLevel"
                        value={userLevel}
                        onChange={(e) => setUserLevel(e.target.value as any)}
                        className="w-full px-3 py-2 transition-colors border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                      >
                        <option value="beginner">Baru mulai dari nol</option>
                        <option value="intermediate">{`Sudah paham dasar-dasar ${topic || 'topik ini'}`}</option>
                        <option value="pro">Profesional yang ingin menambah skill</option>
                      </select>
                    </div>
                    {/* 3. Tujuan Akhir */}
                    <div>
                      <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-1.5">Tujuan Akhir <span className="text-slate-400">(Opsional)</span></label>
                      <input id="goal" type="text" value={finalGoal} onChange={(e) => setFinalGoal(e.target.value)} placeholder="Contoh: Lulus ujian sertifikasi" className="w-full px-3 py-2 text-sm border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    {/* 4. Pengaturan Waktu (toggle) */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Pengaturan Waktu</span>
                        <button type="button" onClick={() => setEnableTimeOptions(v=>!v)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enableTimeOptions ? 'bg-blue-600' : 'bg-slate-300'}`} aria-pressed={enableTimeOptions} aria-label="Toggle waktu">
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${enableTimeOptions ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      {enableTimeOptions && (
                        <div className="mt-3 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hari Tersedia</label>
                            <div className="grid grid-cols-3 gap-2 text-xs text-center">
                              <button type="button" onClick={() => setAvailableDays('all')} className={`p-2 border rounded-md ${availableDays === 'all' ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold' : 'border-slate-300'}`}>Semua</button>
                              <button type="button" onClick={() => setAvailableDays('weekdays')} className={`p-2 border rounded-md ${availableDays === 'weekdays' ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold' : 'border-slate-300'}`}>Kerja</button>
                              <button type="button" onClick={() => setAvailableDays('weekends')} className={`p-2 border rounded-md ${availableDays === 'weekends' ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold' : 'border-slate-300'}`}>Akhir Pekan</button>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1.5">Durasi Belajar per Hari</label>
                            <div className="flex items-center gap-2">
                              <input id="duration" type="range" min="1" max="8" value={dailyDuration} onChange={(e) => setDailyDuration(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                              <span className="text-sm font-semibold text-slate-600 w-16 text-right">{dailyDuration} jam</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1.5">Tgl Mulai <span className="text-slate-400">(Opsional)</span></label>
                              <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div>
                              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1.5">Tgl Selesai <span className="text-slate-400">(Opsional)</span></label>
                              <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-black pt-6 pb-2">
                <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed">{isLoading ? 'Membuat Roadmap...' : 'Buat Roadmap'}</button>
              </div>
            </form>
            {error && (<div className="p-3 mt-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg"><strong>Oops!</strong> {error}</div>)}
          </>
        ) : (
          <>
            <header className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Roadmap Dengan AI</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 truncate">Gunakan instruksi untuk memodifikasi roadmap Anda.</p>
              </div>
              <button
                type="button"
                onClick={() => setNewFormOpen((v)=>!v)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                title="Buat Roadmap Baru"
                aria-pressed={newFormOpen}
              >
                <FilePlus2 className="h-4 w-4" />
              </button>
            </header>
            <div className="mt-4">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="rounded" checked={useAdvancedContext} onChange={(e)=>setUseAdvancedContext(e.target.checked)} />
                Advanced
              </label>
            </div>
            <div key={listKey} className="flex-1 overflow-y-auto px-1 py-3 space-y-2">
              {chatMessages.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">Ketik instruksi, misal: &quot;Tambahkan milestone untuk interview&quot; atau &quot;Selesaikan dalam 6 minggu&quot;.</div>
              ) : (
                chatMessages.map((m, i) => (
                  <ChatBubble key={i} role={m.role} content={m.content} />
                ))
              )}
              {chatLoading && <TypingBubble />}
            </div>
            <form onSubmit={handleChatSubmit} className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center gap-2">
              <input
                value={chatInput}
                onChange={(e)=>setChatInput(e.target.value)}
                placeholder="Tulis instruksi edit…"
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button disabled={chatLoading || !chatInput.trim()} className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-medium disabled:bg-slate-400">
                Kirim
              </button>
            </form>
          </>
        )}
      </div>
  <div className="relative flex-grow bg-slate-50 dark:bg-black flex flex-col">
        {/* Fixed title header after roadmap exists */}
        {roadmapData && (
          <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Judul Roadmap</div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">{roadmapTitle || activeTopic}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  title="Batalkan"
                >
                  Batal
                </button>
                {/* View toggle (match old roadmap UI) */}
                <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowTextView(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm ${!showTextView ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300'}`}
                    title="Lihat Grafik"
                    aria-pressed={!showTextView}
                  >
                    <GitBranch className="h-4 w-4" />
                    <span className="hidden sm:inline">Graph</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTextView(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm ${showTextView ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-300'}`}
                    title="Lihat Teks"
                    aria-pressed={showTextView}
                  >
                    <LayoutList className="h-4 w-4" />
                    <span className="hidden sm:inline">Checklist</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSaveRoadmap}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                  title={saving ? 'Menyimpan…' : 'Simpan Roadmap'}
                >
                  {saving ? 'Menyimpan…' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={cn(
          "relative flex-1 overflow-hidden"
        )}>
          {/* Konten utama: Graph atau Teks */}
          {roadmapData ? (
            showTextView ? (
              <RoadmapTextView data={roadmapData} onClick={handleNodeClick} />
            ) : (
              <RoadmapGraph data={roadmapData} onNodeClick={handleNodeClick} promptMode={activePromptMode} />
            )
          ) : (
            <RoadmapPlaceholder isLoading={isLoading} />
          )}
        </div>
      </div>
      
  {selectedMilestone && ( <MindmapModal isLoading={isModalLoading} mindmapData={mindmapData} explanation={explanation} resources={resources} onClose={() => setSelectedMilestone(null)} topic={selectedMilestone.topic} /> )}
    </div>
    )
  );
}
