// components/DashboardSidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PlusSquare, History, Settings as SettingsIcon, Search, User as UserIcon, ChevronLeft, ChevronRight, Home as HomeIcon } from 'lucide-react';
import Image from 'next/image';
import logo_dark from '../public/logo/dark.png'
import logo_light from '../public/logo/light.png'
import { useEffect, useState } from 'react';
import ThemeToggle from './ui/ThemeToggle';

// Komponen internal untuk tautan di sidebar
const SidebarLink = ({ href, icon: Icon, label, expanded, exact = false }: { href: string; icon: React.ElementType; label: string; expanded: boolean; exact?: boolean }) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={label}
      className={`${expanded ? 'flex h-10 w-full items-center gap-3 rounded-lg px-3' : 'flex h-12 w-12 items-center justify-center rounded-lg'} transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon className="h-6 w-6" />
      {expanded && <span className="text-sm font-medium truncate">{label}</span>}
    </Link>
  );
};

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  // Load persisted state and set sensible default based on viewport
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('sidebarExpanded') : null;
      if (saved !== null) {
        setExpanded(saved === '1');
      } else if (typeof window !== 'undefined') {
        setExpanded(window.innerWidth >= 1024); // default expanded on large screens
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarExpanded', expanded ? '1' : '0');
      }
    } catch {}
  }, [expanded]);

  return (
    <aside id="dashboard-sidebar" className={`${expanded ? 'w-64' : 'w-20'} relative bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col ${expanded ? 'items-start' : 'items-center'} h-full transition-[width] duration-200 ease-in-out`} aria-expanded={expanded}>
      <div className={`flex w-full ${expanded ? 'items-center' : 'items-center'} justify-between`}>
        <Link href="/" title="Beranda" className={`${expanded ? 'flex items-center gap-2' : ''}`}>
          <span className="block dark:hidden">
            <Image src={logo_dark} alt='logo belajar yuk' />
          </span>
          <span className="hidden dark:block">
            <Image src={logo_light} alt='logo belajar yuk' />
          </span>
        </Link>
      </div>
      <nav className={`flex flex-col gap-2 mt-4 w-full ${expanded ? 'items-stretch' : 'items-center'}`}>
  <SidebarLink expanded={expanded} href="/dashboard" icon={HomeIcon} label="Beranda" exact />
        <SidebarLink expanded={expanded} href="/dashboard/new" icon={PlusSquare} label="Buat Roadmap" />
        <SidebarLink expanded={expanded} href="/dashboard/browse" icon={Search} label="Jelajahi" />
        {session && (
          <SidebarLink expanded={expanded} href="/dashboard/roadmaps" icon={History} label="Roadmap Saya" />
        )}
      </nav>
      <nav className={`mt-auto flex flex-col ${expanded ? 'items-stretch' : 'items-center'} gap-2 w-full`}>
        {/* Profile avatar above Settings, stays in bottom group */}
        {session && (
          <Link
            href="/dashboard/profile"
            title="Profil"
            className={`${expanded ? 'flex h-10 w-full items-center gap-3 rounded-lg px-3' : 'flex h-12 w-12 items-center justify-center rounded-lg'} transition-colors ${
              pathname.startsWith('/dashboard/profile') ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={28}
                height={28}
                className="rounded-full"
              />
            ) : (
              <UserIcon className="h-6 w-6" />
            )}
            {expanded && <span className="text-sm font-medium truncate">Profil</span>}
          </Link>
        )}
        <SidebarLink expanded={expanded} href="/dashboard/settings" icon={SettingsIcon} label="Settings" />
        <div className={`${expanded ? 'flex justify-between items-center px-1' : ''}`}>
          <ThemeToggle className={expanded ? '' : ''} />
        </div>
      </nav>

      {/* Centered toggle on the divider between sidebar and content */}
      <button
        type="button"
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-controls="dashboard-sidebar"
        onClick={() => setExpanded(v => !v)}
        className="absolute right-[-18px] top-1/2 z-30 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md text-slate-600 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
    </aside>
  );
}
