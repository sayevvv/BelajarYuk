// app/dashboard/new/page.tsx

"use client";

import { useState, FormEvent, Fragment } from "react";
import { z } from "zod";
import RoadmapGraph from "@/components/RoadmapGraph";
import MindmapGraph from "@/components/MindmapGraph";
import RoadmapPlaceholder from "@/components/RoadmapPlaceholder"; // Impor komponen baru
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import AuthButtons from "@/components/AuthButtons";
import Link from 'next/link';

// --- Skema Zod ---
const roadmapSchema = z.object({
  duration: z.string(),
  milestones: z.array(
    z.object({
      timeframe: z.string(),
      topic: z.string(),
      sub_tasks: z.array(z.string()),
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

// --- Komponen Modal ---
const MindmapModal = ({ mindmapData, explanation, isLoading, onClose, topic }: { 
    mindmapData: MindmapData | null, 
    explanation: string | null,
    isLoading: boolean, 
    onClose: () => void, 
    topic: string 
}) => (
    <Transition as={Fragment} show={true} appear>
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true"><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm" /></Transition.Child><Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"><div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden"><header className="flex items-center justify-between flex-shrink-0 p-4 border-b border-slate-200"><h2 className="text-lg font-semibold text-slate-900" id="modal-title">Jabaran Materi: <span className="font-bold text-blue-600">{topic}</span></h2><button onClick={onClose} className="p-1 transition-colors rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100" aria-label="Close modal"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></header><div className="flex flex-grow overflow-hidden"><aside className="w-1/3 p-6 overflow-y-auto border-r border-slate-200 bg-slate-50/50"><h3 className="font-semibold text-slate-800">Penjelasan Lengkap</h3>{isLoading || !explanation ? (<div className="space-y-4 mt-2"><div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div><div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div><div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse"></div><div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div></div>) : (<p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-slate-600">{explanation}</p>)}</aside><main className="relative flex-grow w-2/3">{isLoading ? (<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50"><span className="font-medium text-slate-600">Membangun mindmap...</span></div>) : (mindmapData ? <MindmapGraph data={mindmapData} /> : <div className="flex items-center justify-center h-full text-slate-400">Mindmap akan muncul di sini.</div>)}</main></div></div></Transition.Child></div>
    </Transition>
);

// --- Komponen Halaman Buat Roadmap Baru ---
export default function NewRoadmapPage() {
  const { data: session, status } = useSession();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mindmapData, setMindmapData] = useState<MindmapData | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
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

  if (status === "loading") {
    return <div className="flex h-full items-center justify-center"><p>Loading session...</p></div>
  }

  const handleNodeClick = async (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsModalLoading(true);
    setMindmapData(null);
    setExplanation(null);
    setError(null);
    const detailsForApi = milestone.sub_tasks.join('\n- ');
    try {
      const [mindmapResponse, explanationResponse] = await Promise.all([
        fetch('/api/generate-mindmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: milestone.topic, details: detailsForApi }), }),
        fetch('/api/generate-explanation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: milestone.topic, details: detailsForApi }), })
      ]);
      if (!mindmapResponse.ok || !explanationResponse.ok) throw new Error(`Server error`);
      const mindmapResult = await mindmapResponse.json();
      const parsedMindmap = mindmapSchema.safeParse(mindmapResult);
      if (parsedMindmap.success) setMindmapData(parsedMindmap.data); else console.error("Zod validation error for mindmap:", parsedMindmap.error);
      const explanationResult = await explanationResponse.json();
      const parsedExplanation = explanationSchema.safeParse(explanationResult);
      if (parsedExplanation.success) setExplanation(parsedExplanation.data.explanation); else console.error("Zod validation error for explanation:", parsedExplanation.error);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data detail.");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRoadmapData(null);
    let details = simpleDetails;
    if (promptMode === 'advanced') {
        const dayMapping: { [key: string]: string } = { all: 'Setiap Hari (Kerja & Akhir Pekan)', weekdays: 'Hanya Hari Kerja', weekends: 'Hanya Akhir Pekan' };
        details = `Ketersediaan Waktu: ${dayMapping[availableDays]}. Durasi Belajar Maksimal: ${dailyDuration} jam per hari. Periode Belajar: Dari ${startDate || 'sekarang'} sampai ${endDate || 'tidak ditentukan'}. Tujuan Akhir: ${finalGoal || 'Menguasai topik secara fundamental'}.`.trim();
    }
    try {
      const response = await fetch('/api/generate-roadmap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, details, promptMode }), });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      const parsedData = roadmapSchema.safeParse(data);
      if (parsedData.success) { setRoadmapData(parsedData.data); } else { console.error("Validation Error:", parsedData.error); throw new Error("Struktur data dari server tidak valid."); }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoadmap = async () => {
    if (!session) {
      alert("Silakan login untuk menyimpan roadmap Anda.");
      window.location.href = '/login?callbackUrl=/dashboard/new';
      return;
    }
    if (!roadmapData) {
      alert("Tidak ada roadmap untuk disimpan!");
      return;
    }
    try {
      const response = await fetch('/api/roadmaps/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: topic, content: roadmapData, }), });
      if (!response.ok) throw new Error("Gagal menyimpan roadmap.");
      alert("Roadmap berhasil disimpan!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-full">
      <AuthButtons />
      <div className="w-[400px] bg-white p-8 flex flex-col flex-shrink-0">
        <header>
            <h1 className="text-2xl font-bold text-slate-900">Buat Rencana Baru</h1>
            <p className="mt-2 text-sm text-slate-500">Isi detail di bawah untuk memulai.</p>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow mt-8">
            <div className="flex p-1 mb-6 bg-slate-100 rounded-lg">
                <button type="button" onClick={() => setPromptMode('simple')} className={`w-1/2 p-2 text-sm font-semibold rounded-md transition-colors ${promptMode === 'simple' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Simple</button>
                <button type="button" onClick={() => setPromptMode('advanced')} className={`w-1/2 p-2 text-sm font-semibold rounded-md transition-colors ${promptMode === 'advanced' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Advanced</button>
            </div>
            <div>
                <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1.5">Topik Utama</label>
                <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Contoh: Belajar Next.js dari Dasar" className="w-full px-3 py-2 transition-colors border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
            </div>
            <div className="mt-4 flex-grow overflow-y-auto pr-2">
                {promptMode === 'simple' ? (
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1.5">Detail Tambahan <span className="text-slate-400">(Opsional)</span></label>
                        <textarea id="details" value={simpleDetails} onChange={(e) => setSimpleDetails(e.target.value)} placeholder="Contoh: Saya sudah paham dasar React." className="w-full h-24 px-3 py-2 transition-colors border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                ) : (
                    <div className="space-y-4">
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
                        <div>
                            <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-1.5">Tujuan Akhir <span className="text-slate-400">(Opsional)</span></label>
                            <input id="goal" type="text" value={finalGoal} onChange={(e) => setFinalGoal(e.target.value)} placeholder="Contoh: Lulus ujian sertifikasi" className="w-full px-3 py-2 text-sm border rounded-lg shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-auto pt-6">
                <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed">{isLoading ? 'Membuat Roadmap...' : 'Buat Roadmap'}</button>
            </div>
        </form>
        {error && (<div className="p-3 mt-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg"><strong>Oops!</strong> {error}</div>)}
        {roadmapData && (<div className="mt-4"><button onClick={handleSaveRoadmap} className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200">Simpan Roadmap</button></div>)}
      </div>
      <div className="relative flex-grow bg-slate-50">
        {/* Konten utama sekarang menggunakan placeholder */}
        {roadmapData ? (
          <RoadmapGraph data={roadmapData} onNodeClick={handleNodeClick} promptMode={promptMode} />
        ) : (
          <RoadmapPlaceholder isLoading={isLoading} />
        )}
      </div>
      {selectedMilestone && ( <MindmapModal isLoading={isModalLoading} mindmapData={mindmapData} explanation={explanation} onClose={() => setSelectedMilestone(null)} topic={selectedMilestone.topic} /> )}
    </div>
  );
}
