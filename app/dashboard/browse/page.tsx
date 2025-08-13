// app/dashboard/browse/page.tsx
import Link from 'next/link';
import { headers } from 'next/headers';
import SaveRoadmapButton from '@/components/SaveRoadmapButton';
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
  const res = await fetch(`${base}/api/public/roadmaps${qs.toString() ? `?${qs.toString()}` : ''}`, { cache: 'no-store' });
  return res.json();
}

export default async function BrowsePage({ searchParams }: { searchParams: BrowseParams }) {
  const { q = '', sort = 'newest', page = '1', pageSize = '12' } = searchParams || {} as BrowseParams;
  const [data, session] = await Promise.all([
    getData({ q, sort, page, pageSize }),
    getServerSession(authOptions as any),
  ]);
  const s: any = session || {};

  return (
    <div className="h-full overflow-y-auto bg-white">
      <header className="p-8 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <h1 className="text-3xl font-bold text-slate-900">Jelajahi Roadmap</h1>
        <p className="mt-1 text-slate-500">Koleksi roadmap yang dipublikasikan pengguna.</p>
        <form action="" className="mt-4 flex items-center gap-3">
          <input name="q" defaultValue={q} placeholder="Cari roadmap…" className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg" />
          <select name="sort" defaultValue={sort} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title_asc">Judul A-Z</option>
            <option value="title_desc">Judul Z-A</option>
          </select>
          <input type="hidden" name="pageSize" value={pageSize} />
        </form>
      </header>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.items?.map((item: any) => (
          <div key={item.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all">
            <Link href={`/r/${item.slug}`} className="block">
              <h3 className="font-bold text-slate-800 text-lg truncate">{item.title}</h3>
              <div className="text-sm text-slate-500 mt-2">oleh {item.user?.name || 'Pengguna'}</div>
              <p className="text-sm text-slate-600 mt-4 border-t border-slate-200 pt-4">
                <strong>Tahapan:</strong> {item.content?.milestones?.length || 0}
              </p>
            </Link>
            {(!s?.user?.id || s.user.id !== item.userId) && (
              <div className="mt-4">
                <SaveRoadmapButton roadmapId={item.id} />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="px-8 pb-10 flex items-center justify-between text-sm text-slate-600">
        <div>Halaman {data?.page || page} dari {data?.totalPages || 1}</div>
        <div className="flex items-center gap-2">
          {Number(data?.page || page) > 1 ? (
            <Link href={{ pathname: '/dashboard/browse', query: { q, sort, page: String(Number(data?.page || page) - 1), pageSize } }} className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50">Sebelumnya</Link>
          ) : <span className="px-3 py-1.5 rounded border border-transparent text-slate-400">Sebelumnya</span>}
          {Number(data?.page || page) < Number(data?.totalPages || 1) ? (
            <Link href={{ pathname: '/dashboard/browse', query: { q, sort, page: String(Number(data?.page || page) + 1), pageSize } }} className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50">Berikutnya</Link>
          ) : <span className="px-3 py-1.5 rounded border border-transparent text-slate-400">Berikutnya</span>}
        </div>
      </div>
    </div>
  );
}
