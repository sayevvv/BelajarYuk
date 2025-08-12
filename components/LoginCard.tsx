// components/LoginCard.tsx
"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"; // Install: npm install react-icons

export default function LoginCard() {
  return (
    <div className="p-8 text-center bg-white border shadow-lg rounded-2xl border-slate-200 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-slate-900">Selamat Datang!</h1>
      <p className="mt-2 text-sm text-slate-500">
        Login untuk menyimpan dan mengakses roadmap belajar Anda.
      </p>
      <div className="mt-8">
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center w-full gap-3 px-4 py-3 font-semibold text-gray-700 transition-colors bg-white border rounded-lg shadow-sm border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FcGoogle className="w-6 h-6" />
          <span>Lanjutkan dengan Google</span>
        </button>
      </div>
    </div>
  );
}