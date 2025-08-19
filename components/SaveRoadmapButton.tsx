"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export default function SaveRoadmapButton({ roadmapId }: { roadmapId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { show } = useToast();

  async function handleSave() {
    try {
      setLoading(true);
    const res = await fetch(`/api/roadmaps/${roadmapId}/fork`, { method: 'POST' });
      if (!res.ok) {
        if (res.status === 401) {
      // best-effort: go back to browse after login
      router.push(`/login?callbackUrl=/dashboard/browse`);
          return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal menyimpan roadmap');
      }
      const data = await res.json();
      show({ type: 'success', title: 'Tersimpan', message: 'Roadmap disalin ke Roadmap Saya.' });
      router.push(`/dashboard/roadmaps/${data.id}`);
    } catch (e) {
      console.error(e);
      show({ type: 'error', title: 'Gagal', message: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleSave} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
      {loading ? 'Menyimpan…' : 'Simpan ke Roadmap Saya'}
    </button>
  );
}
