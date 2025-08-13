// components/LoginCard.tsx
"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginCard() {
  return (
    <div className="w-full space-y-8">
      {/* Login Button with Swiss Design */}
      <div className="space-y-6">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="group relative w-full h-14 bg-slate-900 text-white font-medium tracking-wide transition-all duration-200 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 active:scale-[0.98] overflow-hidden"
        >
          {/* Swiss Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="relative flex items-center justify-center gap-4">
            <FcGoogle className="h-6 w-6" />
            <span className="font-medium tracking-wide">Lanjutkan dengan Google</span>
          </div>
        </button>

        {/* Alternative Login Methods */}
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 font-medium tracking-wide">
                ATAU
              </span>
            </div>
          </div>
        </div>

        {/* Email Login Placeholder */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            disabled
            className="w-full h-12 px-4 border border-slate-300 bg-slate-50 text-slate-400 font-medium tracking-wide focus:outline-none cursor-not-allowed"
          />
          <button
            disabled
            className="w-full h-12 border border-slate-300 text-slate-400 font-medium tracking-wide cursor-not-allowed"
          >
            Masuk dengan Email
          </button>
          <p className="text-xs text-slate-400 text-center font-medium tracking-wide">
            Metode ini akan tersedia segera
          </p>
        </div>
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
          Dengan melanjutkan, Anda menyetujui{" "}
          <a href="#" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
            Syarat Layanan
          </a>{" "}
          dan{" "}
          <a href="#" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
            Kebijakan Privasi
          </a>{" "}
          kami.
        </p>
        
        {/* Swiss Typography Accent */}
        <div className="flex justify-center">
          <div className="w-8 h-px bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
}
