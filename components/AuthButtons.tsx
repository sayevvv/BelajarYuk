// components/AuthButtons.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link"; // Impor Link

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-24 h-8 bg-slate-200 rounded-lg animate-pulse" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <Image 
            src={session.user.image} 
            alt={session.user.name || "User avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <button 
          onClick={() => signOut()} 
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          title="Logout"
        >
          Logout
        </button>
      </div>
    );
  }

  // Ganti tombol menjadi Link
  return (
    <Link 
      href="/login" 
      className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Login
    </Link>
  );
}