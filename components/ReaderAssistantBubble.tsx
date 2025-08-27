"use client";
import { useState } from 'react';

export default function ReaderAssistantBubble() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [a, setA] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!q.trim()) return;
    setLoading(true);
    try {
      // Placeholder: echo answer; can be wired to an explain endpoint later
      await new Promise((r) => setTimeout(r, 400));
      setA(`Jawaban singkat: ${q}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-30 rounded-full bg-slate-900 text-white px-4 py-2 shadow-lg">tanya saya</button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-4 z-50">
            <div className="text-lg font-semibold">Tanya Materi</div>
            <textarea value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Apa yang membingungkan?" className="mt-3 w-full border rounded-md p-2 h-28" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-md border">Tutup</button>
              <button onClick={ask} disabled={loading} className="px-3 py-1.5 rounded-md bg-blue-600 text-white">{loading ? 'Memproses…' : 'Tanya'}</button>
            </div>
            {a ? <div className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">{a}</div> : null}
          </div>
        </div>
      )}
    </>
  );
}
