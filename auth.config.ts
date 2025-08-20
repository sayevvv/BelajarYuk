import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";

export const authOptions: NextAuthOptions = {
  // Trust proxy headers (X-Forwarded-*) on platforms like Vercel
  // to correctly determine the host/protocol and avoid 500s.
  // You can also set AUTH_TRUST_HOST=true in env instead of this flag.
  // @ts-ignore - property is supported in next-auth v4.22+
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth (optional)
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    // Manual email/password
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase().trim();
  const user = (await prisma.user.findUnique({ where: { email } })) as any;
  if (!user || !user.passwordHash) return null;
  const ok = await argon2.verify(user.passwordHash as string, String(credentials.password));
        if (!ok) return null;
        return { id: user.id, name: user.name || null, email: user.email || null } as any;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  // Secret akan diambil dari process.env.AUTH_SECRET secara otomatis
  // oleh NextAuth, tetapi menambahkannya di sini untuk kejelasan juga baik.
  // Dukung kedua nama env var: NEXTAUTH_SECRET (NextAuth v4) dan AUTH_SECRET (Auth.js v5)
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};