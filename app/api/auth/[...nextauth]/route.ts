import NextAuth from "next-auth";
import { authOptions } from "@/auth.config"; // Impor konfigurasi

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };