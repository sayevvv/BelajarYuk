// components/DashboardSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PlusSquare, History } from 'lucide-react';
import Image from 'next/image';
import logo_dark from '../public/logo/dark.png'
import logo_light from '../public/logo/light.png'

// Komponen internal untuk tautan di sidebar
const SidebarLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={label}
      className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default function DashboardSidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-20 bg-white border-r border-slate-200 p-4 flex flex-col items-center gap-4">
      <Link href="/" title="Beranda">
        <Image src={logo_dark} alt='logo belajar yuk'/>
      </Link>
      <nav className="flex flex-col gap-4 mt-4">
        <SidebarLink href="/dashboard/new" icon={PlusSquare} label="Buat Rencana Baru" />
        {/* Tampilkan ikon riwayat hanya jika pengguna sudah login */}
        {session && (
          <SidebarLink href="/dashboard/history" icon={History} label="Riwayat Roadmap" />
        )}
      </nav>
    </aside>
  );
}
