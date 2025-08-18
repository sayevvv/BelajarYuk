// components/LoginCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });
      if (res?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Email atau kata sandi salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Login Button with Swiss Design */}
      <div className="space-y-6">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="group relative w-full h-14 bg-slate-900 text-white font-medium tracking-wide transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 active:scale-[0.98] overflow-hidden"
        >
          {/* Swiss Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative flex items-center justify-center gap-4">
            <FcGoogle className="h-6 w-6" />
            <span className="font-medium tracking-wide">Lanjutkan dengan Google</span>
          </div>
        </button>

        {/* Alternative Login Methods */}
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 font-medium tracking-wide">ATAU</span>
            </div>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
              minLength={8}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 font-medium" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-slate-900 text-white font-medium tracking-wide hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk dengan Email"}
          </button>
          <p className="text-sm text-slate-600 text-center font-medium tracking-wide">
            Belum punya akun?{" "}
            <Link href="/signup" className="text-slate-900 underline underline-offset-4">
              Daftar
            </Link>
          </p>
        </form>
      </div>

      {/* Swiss Design Separator */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-slate-200"></div>
        <div className="w-2 h-2 bg-slate-300 rotate-45"></div>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      {/* Terms and Privacy */}
      <div className="text-center space-y-4">
        <p className="text-xs text-slate-500 leading-relaxed font-medium tracking-wide">
          Dengan melanjutkan, Anda menyetujui {" "}
          <a href="#" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
            Syarat Layanan
          </a> {" "}
          dan {" "}
          <a href="#" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
            Kebijakan Privasi
          </a> {" "}
          kami.
        </p>
        <div className="flex justify-center">
          <div className="w-8 h-px bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
}
