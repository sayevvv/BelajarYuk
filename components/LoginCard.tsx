// components/LoginCard.tsx
"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginCard() {
  return (
    // Wrapper utama tanpa background atau shadow, menyatu dengan halaman.
    <div className="w-full">
      {/* Header dengan tipografi yang lebih kuat */}
      <div className="text-left mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Selamat Datang
        </h1>
        <p className="mt-2 text-slate-600">
          Login untuk mengakses semua fitur BelajarYuk.
        </p>
      </div>

      {/* Tombol Aksi */}
      <div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-slate-800 text-white font-semibold shadow-sm transition-all hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          <FcGoogle className="h-6 w-6" />
          <span>Lanjutkan dengan Google</span>
        </button>
      </div>

      {/* Teks Kebijakan */}
      <p className="mt-8 text-xs text-center text-slate-500">
        Dengan melanjutkan, Anda menyetujui Syarat Layanan dan Kebijakan Privasi kami.
      </p>
    </div>
  );
}
