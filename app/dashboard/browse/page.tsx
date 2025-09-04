// app/dashboard/browse/page.tsx
import Link from 'next/link';
import { headers } from 'next/headers';
import RoadmapCard from '@/components/RoadmapCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

type BrowseParams = { q?: string; sort?: string; page?: string; pageSize?: string };
async function getBaseUrl() {
  try {
  const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';
    if (host) return `${proto}://${host}`;
  } catch {}
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

async function getData(params: BrowseParams) {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', params.page);
  if (params.pageSize) qs.set('pageSize', params.pageSize);
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/public/roadmaps${qs.toString() ? `?${qs.toString()}` : ''}`, {
    next: { tags: ['public-roadmaps'] },
  });
  return res.json();
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = (sp?.q as string) || '';
  const sort = (sp?.sort as string) || 'newest';
  const page = (sp?.page as string) || '1';
  const pageSize = (sp?.pageSize as string) || '12';
  const [data, session] = await Promise.all([
    getData({ q, sort, page, pageSize }),
    getServerSession(authOptions as any),
  ]);
  const s: any = session || {};

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-900">
      <header className="p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Jelajahi Roadmap</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Koleksi roadmap yang dipublikasikan pengguna.</p>
        <form action="" className="mt-4 flex items-center gap-3">
          <input name="q" defaultValue={q} placeholder="Cari roadmap…" className="w-full max-w-md px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400" />
          <select name="sort" defaultValue={sort} className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title_asc">Judul A-Z</option>
            <option value="title_desc">Judul Z-A</option>
          </select>
          <input type="hidden" name="pageSize" value={pageSize} />
        </form>
      </header>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.items?.map((item: any) => {
          const own = s?.user?.id && s.user.id === item.userId;
      return (
            <div key={item.id}>
              <RoadmapCard
                item={item}
                hideInlineTopics={false}
                hideRatings={own}
                own={!!own}
                showBottomChip
              />
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      <div className="px-8 pb-10 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <div>Halaman {data?.page || page} dari {data?.totalPages || 1}</div>
        <div className="flex items-center gap-2">
          {Number(data?.page || page) > 1 ? (
            <Link href={{ pathname: '/dashboard/browse', query: { q, sort, page: String(Number(data?.page || page) - 1), pageSize } }} className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Sebelumnya</Link>
          ) : <span className="px-3 py-1.5 rounded border border-transparent text-slate-400">Sebelumnya</span>}
          {Number(data?.page || page) < Number(data?.totalPages || 1) ? (
            <Link href={{ pathname: '/dashboard/browse', query: { q, sort, page: String(Number(data?.page || page) + 1), pageSize } }} className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">Berikutnya</Link>
          ) : <span className="px-3 py-1.5 rounded border border-transparent text-slate-400">Berikutnya</span>}
        </div>
      </div>
    </div>
  );
}
