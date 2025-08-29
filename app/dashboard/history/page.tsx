// app/dashboard/history/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { PlusSquare, Clock } from 'lucide-react';

const prisma = new PrismaClient();

// Tentukan struktur konten roadmap untuk keamanan tipe
interface RoadmapContent {
  duration: string;
  milestones: {
    topic: string;
    timeframe: string;
  }[];
}

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  // Jika pengguna tidak login, tampilkan pesan untuk login
  if (!session?.user?.id) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-8 bg-white">
        <h1 className="text-2xl font-bold text-slate-800">Akses Ditolak</h1>
        <p className="mt-2 text-slate-600 max-w-md">
          Anda harus login terlebih dahulu untuk melihat dan mengelola riwayat roadmap Anda.
        </p>
        <Link href="/login?callbackUrl=/dashboard/history" className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  // Ambil data roadmap dari database
  const roadmaps = await prisma.roadmap.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-black">
      <header className="p-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Roadmap Saya</h1>
  <p className="mt-1 text-slate-500 dark:text-slate-400">Kelola semua roadmap yang Anda miliki dan kerjakan.</p>
      </header>
      <div className="p-8">
        {roadmaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl">
              <h2 className="text-xl font-semibold text-slate-700">Belum Ada Riwayat</h2>
              <p className="mt-2 text-slate-500">Anda belum menyimpan roadmap apapun. Mulai buat sekarang!</p>
              <Link href="/dashboard/new" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                <PlusSquare className="h-4 w-4" />
                Buat Rencana Baru
              </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => {
              const content = roadmap.content as unknown as RoadmapContent;
              return (
                <Link href={`/dashboard/roadmaps/${roadmap.id}?from=history`} key={roadmap.id} className="block bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all">
                  <h3 className="font-bold text-slate-800 text-lg truncate">{roadmap.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                    <Clock className="h-4 w-4" />
                    <span>Dibuat pada {new Date(roadmap.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-4 border-t border-slate-200 pt-4">
                    <strong>Durasi:</strong> {content.duration} | <strong>Tahapan:</strong> {content.milestones.length}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
