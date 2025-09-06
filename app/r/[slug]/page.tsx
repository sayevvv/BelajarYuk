// app/r/[slug]/page.tsx
import SaveRoadmapButton from '@/components/SaveRoadmapButton';
import PublicRoadmapClient from '@/components/PublicRoadmapClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MobileBackBar from '@/components/MobileBackBar';
import VerifyRoadmapButton from '@/components/VerifyRoadmapButton';
import RatingSummary from '@/components/RatingSummary';
import TopicChips from '@/components/TopicChips';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

async function getBaseUrl() {
  // Prefer current request host to avoid env/domain mismatches in production
  try {
  const h = await headers();
    const proto = h.get('x-forwarded-proto') || 'https';
    const host = h.get('x-forwarded-host') || h.get('host');
    if (host) return `${proto}://${host}`;
  } catch {}
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

async function getData(slug: string) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/roadmaps/${slug}`, {
    // Avoid stale caches on preview/dev; keep tag-based revalidation for prod
    cache: process.env.VERCEL_ENV === 'production' ? 'force-cache' : 'no-store',
    next: { tags: [`public-roadmap:${slug}`] },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PublicRoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getData(slug);
  if (!roadmap) return <div className="p-8">Tidak ditemukan.</div>;
  const content = (roadmap as any).content as any;
  const session = (await getServerSession(authOptions as any)) as any;
  const isAdmin = (session as any)?.user?.role === 'ADMIN';
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-black">
      {/* Mobile top bar: back only, no sidebar/nav */}
    <MobileBackBar title={(roadmap as any).title} subtitle={`oleh ${(roadmap as any).user?.name || 'Pengguna'}`} />

      {/* Desktop header */}
      <header className="hidden md:block p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard/browse" className="inline-flex items-center justify-center rounded-full h-9 w-9 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-[#1a1a1a]" aria-label="Kembali">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                <span className="truncate">{(roadmap as any).title}</span>
                {(roadmap as any).verified ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 border border-emerald-200">Dev’s Choice</span>
                ) : null}
              </h1>
              <div className="mt-1 text-slate-500 dark:text-slate-400">oleh {(roadmap as any).user?.name || 'Pengguna'}</div>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-4">
            <TopicChips roadmapId={(roadmap as any).id} />
            <RatingSummary roadmapId={(roadmap as any).id} canRate={(roadmap as any).published && (roadmap as any).user?.id !== (session as any)?.user?.id} />
            {(roadmap as any).published && (roadmap as any).user?.id !== (session as any)?.user?.id ? (
              <SaveRoadmapButton roadmapId={(roadmap as any).id} />
            ) : null}
            {isAdmin ? (
              <VerifyRoadmapButton roadmapId={(roadmap as any).id} verified={(roadmap as any).verified} />
            ) : null}
          </div>
        </div>
      </header>

      <div className="px-4 pb-8 md:px-0">
        <PublicRoadmapClient content={content} />
      </div>
    </div>
  );
}

