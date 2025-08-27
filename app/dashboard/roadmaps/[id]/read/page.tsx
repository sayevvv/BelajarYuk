// app/dashboard/roadmaps/[id]/read/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import ReaderProgressClient from '@/components/ReaderProgressClient';
import ReaderAssistantBubble from '@/components/ReaderAssistantBubble';
import ReaderScrollReset from '@/components/ReaderScrollReset';
import NextMaterialLink from '@/components/NextMaterialLink';

async function getRoadmap(id: string) {
  const r = await prisma.roadmap.findUnique({ where: { id }, include: { progress: true } });
  return r;
}

export default async function ReadMaterialPage(props: any) {
  const { id } = await (props as any).params;
  const sp = await (props as any).searchParams;
  const roadmap = await getRoadmap(id);
  if (!roadmap) return notFound();
  const content: any = (roadmap as any).content || {};
  const byMilestone: any[][] = content.materialsByMilestone || [];
  const m = Number((sp?.m as any) ?? 0);
  const s = Number((sp?.s as any) ?? 0);
  const current = byMilestone?.[m]?.[s];

  const next = (() => {
    if (!byMilestone?.length) return null;
    let nm = m, ns = s + 1;
    if (!byMilestone[nm] || !byMilestone[nm][ns]) {
      nm = m + 1; ns = 0;
      if (!byMilestone[nm] || !byMilestone[nm][ns]) return null;
    }
    return { m: nm, s: ns };
  })();

  const thisMilestone: any[] = Array.isArray(byMilestone?.[m]) ? byMilestone[m] : [];
  const totalCurrentMilestone = thisMilestone.length;
  const indicator = totalCurrentMilestone > 0 ? `Subbab ${s + 1} dari ${totalCurrentMilestone}` : '';
  const hasNextInSameMilestone = !!thisMilestone?.[s + 1];
  const isLastInMilestone = totalCurrentMilestone > 0 && !hasNextInSameMilestone;
  const quizKey = `quiz-m-${m}`;
  const quizPassed = !!(roadmap as any).progress?.completedTasks?.[quizKey]?.passed;

  // Enforce quiz gating: to access milestone m (>0), previous quiz must be passed
  if (m > 0) {
    const prevKey = `quiz-m-${m - 1}`;
    const passed = (roadmap as any).progress?.completedTasks?.[prevKey]?.passed === true;
    if (!passed) {
      redirect(`/dashboard/roadmaps/${roadmap.id}/quiz?m=${m - 1}`);
    }
  }

  return (
  <div id="reader-scroller" className="h-full overflow-y-auto bg-white">
      <header className="relative p-6 border-b border-slate-200">
        <Link href={`/dashboard/roadmaps/${roadmap.id}`} className="absolute left-6 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 text-slate-700 hover:text-slate-900">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Kembali</span>
        </Link>
        <div className="text-center">
          <div className="text-sm text-slate-500">{roadmap.title}</div>
          <h1 className="text-xl font-bold text-slate-900">Materi Belajar</h1>
          {indicator ? <div className="text-xs text-slate-500 mt-1">{indicator}</div> : null}
        </div>
        {/* Optional right-side slot
        <div className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 text-sm text-slate-600">Progress</div>
        */}
      </header>
      <main className="max-w-3xl mx-auto p-6">
        {!current ? (
          <div className="text-slate-500">Materi belum disiapkan. Silakan kembali dan klik tombol Mulai Belajar.</div>
        ) : (
          <article className="mb-10">
            <div className="rounded-xl bg-slate-100 flex items-center justify-center h-40 text-slate-500">{current.heroImage ? <img src={current.heroImage} alt={current.title} className="h-40 w-full object-cover rounded-xl"/> : 'Ambil Gambar Random Unsplash'}</div>
            <h2 className="mt-6 text-lg font-bold text-slate-900">{current.title}</h2>
            <div className="mt-2 whitespace-pre-wrap text-slate-700 leading-7">{current.body}</div>
            {Array.isArray(current.points) && current.points.length ? (
              <div className="mt-4">
                {current.points.map((p: string, pi: number) => (
                  <div key={pi} className="font-semibold text-slate-800 mt-3">{p}</div>
                ))}
              </div>
            ) : null}
            <div id="read-end-sentinel" className="mt-10 h-px" />
            <div className="mt-10 flex justify-end">
              {(() => {
                // If not last in current milestone, go to next material within the same milestone
        if (!isLastInMilestone && next) {
                  return (
                    <NextMaterialLink
          href={`/dashboard/roadmaps/${roadmap.id}/read?m=${m}&s=${s + 1}`}
                      roadmapId={roadmap.id}
                      m={m}
                      s={s}
                      className="inline-flex items-center gap-2 text-blue-700 font-semibold"
                    >
                      Materi Selanjutnya →
                    </NextMaterialLink>
                  );
                }
                // Last in milestone: by default, go to quiz for this node
                if (isLastInMilestone && !quizPassed) {
                  return (
                    <NextMaterialLink
                      href={`/dashboard/roadmaps/${roadmap.id}/quiz?m=${m}`}
                      roadmapId={roadmap.id}
                      m={m}
                      s={s}
                      className="inline-flex items-center gap-2 text-blue-700 font-semibold"
                    >
                      Lanjut ke Kuis →
                    </NextMaterialLink>
                  );
                }
                // If quiz already passed, go to next milestone's first material if available
                const hasNextMilestone = Array.isArray(byMilestone?.[m + 1]) && byMilestone[m + 1].length > 0;
                if (isLastInMilestone && quizPassed && hasNextMilestone) {
                  return (
                    <NextMaterialLink
                      href={`/dashboard/roadmaps/${roadmap.id}/read?m=${m + 1}&s=0`}
                      roadmapId={roadmap.id}
                      m={m}
                      s={s}
                      className="inline-flex items-center gap-2 text-blue-700 font-semibold"
                    >
                      Lanjut ke Tahap Berikutnya →
                    </NextMaterialLink>
                  );
                }
                // Otherwise, back to roadmap
                return (
                  <Link href={`/dashboard/roadmaps/${roadmap.id}`} className="inline-flex items-center gap-2 text-slate-700 font-semibold">
                    Kembali ke Roadmap
                  </Link>
                );
              })()}
            </div>
          </article>
        )}
      </main>
      <ReaderProgressClient roadmapId={roadmap.id} m={m} s={s} />
      <ReaderAssistantBubble />
  {/* Ensure scroll resets to top on subbab change */}
  <ReaderScrollReset deps={[m, s]} behavior="smooth" />
    </div>
  );
}
