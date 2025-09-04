// next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  /**
   * Diperluas untuk menyertakan properti 'id' pada objek user di dalam session.
   */
  interface Session {
    user: {
      id: string; // Tambahkan properti id di sini
  role?: 'USER' | 'ADMIN';
    } & DefaultSession['user'];
  }
}