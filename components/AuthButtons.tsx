// components/AuthButtons.tsx
"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa"; // Menggunakan ikon generik

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Tampilan Loading
  if (status === "loading") {
    return <div className="fixed top-4 right-4 h-12 w-32 rounded-lg bg-slate-200 animate-pulse z-50" />;
  }

  // Tampilan jika pengguna sudah login (Authenticated)
  if (session?.user) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-lg backdrop-blur-sm ring-1 ring-slate-200/50">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User avatar"}
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {session.user.name}
            </p>
            <button
              onClick={() => signOut()}
              className="text-xs text-slate-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan jika pengguna belum login (Guest/Unauthenticated)
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Tombol Placeholder Profil Guest */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-lg backdrop-blur-sm ring-1 ring-slate-200/50"
        >
          <FaUserCircle className="h-10 w-10 text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-slate-800">Guest</p>
            <p className="text-xs text-slate-500">Click to login</p>
          </div>
        </button>

        {/* Dropdown Menu untuk Login */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Link
                href="/login"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Login with Google
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}