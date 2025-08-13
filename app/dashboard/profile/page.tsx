// app/dashboard/profile/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex h-full items-center justify-center">Memuat profil…</div>;
  }

  if (!session) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Profil</h1>
          <p className="mt-2 text-slate-600">Anda belum masuk.</p>
          <Link href="/login?callbackUrl=/dashboard/profile" className="inline-flex mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">Masuk</Link>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-slate-900">Profil</h1>
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4">
          {user?.image ? (
            <Image src={user.image} alt={user.name || "User"} width={64} height={64} className="rounded-full" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-200" />
          )}
          <div>
            <div className="text-lg font-semibold text-slate-900">{user?.name || "Pengguna"}</div>
            <div className="text-slate-600 text-sm">{user?.email}</div>
          </div>
          <div className="ml-auto">
            <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700">Keluar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
